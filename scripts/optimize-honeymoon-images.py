#!/usr/bin/env python3
"""Rebuild matched honeymoon images from the high-resolution photo library.

The matching manifest is deliberately separate from this renderer. This script
uses the existing Ghost derivative as a composition and colour reference, then
warps the matched source into that frame at a larger resolution. Public outputs
contain no EXIF metadata. Use --apply only after reviewing the generated report.
"""

from __future__ import annotations

import argparse
import functools
import json
import math
import os
import shutil
import sys
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageOps
import rawpy


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = REPO_ROOT / "data" / "honeymoon-image-matches.json"
DEFAULT_SOURCE_ROOT = REPO_ROOT / ".cache" / "honeymoon-originals"
DEFAULT_ASSET_ROOT = REPO_ROOT / "assets-local"
DEFAULT_OUTPUT_ROOT = REPO_ROOT / ".cache" / "honeymoon-optimized"
DEFAULT_REPORT = REPO_ROOT / "data" / "honeymoon-optimization-report.json"
BACKUP_ROOT = REPO_ROOT / ".cache" / "honeymoon-before"
REMOTE_SOURCE_ROOT = Path("/mnt/rust/photos/alex/images/2011")
RESPONSIVE_WIDTHS = (600, 1000, 1600, 2000, 2400)
MAX_LONG_EDGE = 3200


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--asset-root", type=Path, default=DEFAULT_ASSET_ROOT)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--limit", type=int, help="Render only the first N matched entries")
    parser.add_argument("--apply", action="store_true", help="Copy validated outputs into assets-local")
    return parser.parse_args()


def local_source_path(remote_path: str, source_root: Path) -> Path:
    remote = Path(remote_path)
    try:
        relative = remote.relative_to(REMOTE_SOURCE_ROOT)
    except ValueError as error:
        raise ValueError(f"Source is outside the expected 2011 library: {remote}") from error
    return source_root / relative


@functools.lru_cache(maxsize=3)
def load_source(path_string: str) -> np.ndarray:
    path = Path(path_string)
    if path.suffix.lower() in {".arw", ".dng"}:
        with rawpy.imread(str(path)) as raw:
            rgb = raw.postprocess(
                use_camera_wb=True,
                output_bps=8,
                output_color=rawpy.ColorSpace.sRGB,
                highlight_mode=rawpy.HighlightMode.Blend,
            )
        return np.ascontiguousarray(rgb)

    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        return np.asarray(image).copy()


def load_reference(path: Path) -> np.ndarray:
    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        return np.asarray(image).copy()


def feature_view(image: np.ndarray, maximum: int = 1400) -> tuple[np.ndarray, float]:
    height, width = image.shape[:2]
    scale = min(1.0, maximum / max(width, height))
    if scale < 1:
        resized = cv2.resize(image, (round(width * scale), round(height * scale)), interpolation=cv2.INTER_AREA)
    else:
        resized = image
    gray = cv2.cvtColor(resized, cv2.COLOR_RGB2GRAY)
    gray = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(gray)
    return gray, scale


def transform_points(matrix: np.ndarray, points: np.ndarray) -> np.ndarray:
    shaped = np.asarray(points, dtype=np.float64).reshape(-1, 1, 2)
    return cv2.perspectiveTransform(shaped, matrix).reshape(-1, 2)


def local_source_scale(source_to_reference: np.ndarray, width: int, height: int) -> float:
    inverse = np.linalg.inv(source_to_reference)
    scales: list[float] = []
    for x_fraction, y_fraction in ((0.2, 0.2), (0.5, 0.5), (0.8, 0.8), (0.2, 0.8), (0.8, 0.2)):
        x = width * x_fraction
        y = height * y_fraction
        mapped = transform_points(inverse, np.array([[x, y], [x + 1, y], [x, y + 1]]))
        jacobian = np.column_stack((mapped[1] - mapped[0], mapped[2] - mapped[0]))
        singular = np.linalg.svd(jacobian, compute_uv=False)
        if np.all(np.isfinite(singular)):
            scales.append(float(np.min(singular)))
    return max(1.0, min(scales, default=1.0))


def homography(source: np.ndarray, reference: np.ndarray) -> tuple[np.ndarray | None, dict[str, Any]]:
    source_gray, source_scale = feature_view(source)
    reference_gray, reference_scale = feature_view(reference)
    sift = cv2.SIFT_create(nfeatures=6000, contrastThreshold=0.01, edgeThreshold=14)
    source_keypoints, source_descriptors = sift.detectAndCompute(source_gray, None)
    reference_keypoints, reference_descriptors = sift.detectAndCompute(reference_gray, None)

    details: dict[str, Any] = {
        "sourceKeypoints": len(source_keypoints),
        "referenceKeypoints": len(reference_keypoints),
        "candidateMatches": 0,
        "inliers": 0,
        "inlierRatio": 0.0,
        "reprojectionError": None,
    }
    if source_descriptors is None or reference_descriptors is None:
        return None, details

    pairs = cv2.BFMatcher(cv2.NORM_L2).knnMatch(source_descriptors, reference_descriptors, k=2)
    good = [first for first, second in pairs if first.distance < 0.76 * second.distance]
    details["candidateMatches"] = len(good)
    if len(good) < 8:
        return None, details

    source_points = np.float32([source_keypoints[item.queryIdx].pt for item in good])
    reference_points = np.float32([reference_keypoints[item.trainIdx].pt for item in good])
    work_matrix, mask = cv2.findHomography(
        source_points,
        reference_points,
        cv2.RANSAC,
        4.0,
        maxIters=12000,
        confidence=0.999,
    )
    if work_matrix is None or mask is None:
        return None, details

    inlier_mask = mask.ravel().astype(bool)
    inliers = int(inlier_mask.sum())
    ratio = inliers / len(good)
    details["inliers"] = inliers
    details["inlierRatio"] = round(ratio, 4)
    if inliers < 8 or ratio < 0.25:
        return None, details

    projected = transform_points(work_matrix, source_points[inlier_mask])
    errors = np.linalg.norm(projected - reference_points[inlier_mask], axis=1)
    details["reprojectionError"] = round(float(np.median(errors)), 3)

    source_to_work = np.diag([source_scale, source_scale, 1.0])
    work_to_reference = np.diag([1 / reference_scale, 1 / reference_scale, 1.0])
    full_matrix = work_to_reference @ work_matrix @ source_to_work
    if not np.all(np.isfinite(full_matrix)) or abs(np.linalg.det(full_matrix)) < 1e-10:
        return None, details
    return full_matrix / full_matrix[2, 2], details


def centered_crop(source: np.ndarray, reference_width: int, reference_height: int) -> np.ndarray:
    target_aspect = reference_width / reference_height
    height, width = source.shape[:2]
    source_aspect = width / height
    if source_aspect > target_aspect:
        crop_width = round(height * target_aspect)
        left = (width - crop_width) // 2
        return source[:, left : left + crop_width]
    crop_height = round(width / target_aspect)
    top = (height - crop_height) // 2
    return source[top : top + crop_height, :]


def colour_match(image: np.ndarray, reference: np.ndarray) -> np.ndarray:
    sample = cv2.resize(image, (reference.shape[1], reference.shape[0]), interpolation=cv2.INTER_AREA)
    quantiles = np.linspace(0.5, 99.5, 129)
    output = image.astype(np.float32)
    for channel in range(3):
        source_values = np.percentile(sample[:, :, channel], quantiles)
        reference_values = np.percentile(reference[:, :, channel], quantiles)
        source_values, unique_indices = np.unique(source_values, return_index=True)
        reference_values = reference_values[unique_indices]
        if len(source_values) < 4:
            continue
        mapped = np.interp(output[:, :, channel], source_values, reference_values)
        # A small contribution from the camera rendering avoids amplifying old
        # JPEG artefacts while still matching the historic edit closely.
        output[:, :, channel] = mapped * 0.88 + output[:, :, channel] * 0.12
    return np.clip(output, 0, 255).astype(np.uint8)


def local_tone_match(image: np.ndarray, reference: np.ndarray) -> np.ndarray:
    """Transfer only broad local exposure/colour edits from the old derivative."""
    sample = cv2.resize(image, (reference.shape[1], reference.shape[0]), interpolation=cv2.INTER_AREA)
    residual = reference.astype(np.float32) - sample.astype(np.float32)
    sigma = max(2.0, min(reference.shape[:2]) / 160)
    residual = cv2.GaussianBlur(residual, (0, 0), sigmaX=sigma, sigmaY=sigma)
    residual = cv2.resize(residual, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_CUBIC)
    corrected = image.astype(np.float32) + residual * 0.97
    return np.clip(corrected, 0, 255).astype(np.uint8)


def sharpen(image: np.ndarray) -> np.ndarray:
    blurred = cv2.GaussianBlur(image, (0, 0), sigmaX=1.0, sigmaY=1.0)
    return cv2.addWeighted(image, 1.16, blurred, -0.16, 0)


def similarity(image: np.ndarray, reference: np.ndarray) -> float:
    sample = cv2.resize(image, (reference.shape[1], reference.shape[0]), interpolation=cv2.INTER_AREA)
    sample_gray = cv2.cvtColor(sample, cv2.COLOR_RGB2GRAY).astype(np.float32)
    reference_gray = cv2.cvtColor(reference, cv2.COLOR_RGB2GRAY).astype(np.float32)
    sample_gray -= sample_gray.mean()
    reference_gray -= reference_gray.mean()
    denominator = math.sqrt(float(np.sum(sample_gray**2) * np.sum(reference_gray**2)))
    return float(np.sum(sample_gray * reference_gray) / denominator) if denominator else 0.0


def save_image(image: np.ndarray, target: Path, *, responsive: bool = False) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    pil_image = Image.fromarray(image, "RGB")
    temporary = target.with_name(f".{target.stem}.tmp{target.suffix}")
    extension = target.suffix.lower()
    if extension in {".jpg", ".jpeg"}:
        pil_image.save(
            temporary,
            format="JPEG",
            quality=86 if responsive else 90,
            optimize=True,
            progressive=True,
            subsampling="4:2:0",
        )
    elif extension == ".png":
        pil_image.save(temporary, format="PNG", optimize=True, compress_level=9)
    elif extension == ".webp":
        pil_image.save(temporary, format="WEBP", quality=82, method=6)
    else:
        raise ValueError(f"Unsupported honeymoon output format: {extension}")
    os.replace(temporary, target)


def responsive_paths(ghost_path: str, width: int) -> str:
    # Keep the legacy extension in the derivative basename (photo.jpg.webp).
    # Several Ghost folders contain both 1.jpg and 1.png, so replacing the
    # suffix outright would make those distinct assets collide at 1.webp.
    image_path = ghost_path.removeprefix("/content/images/")
    return f"/content/images/size/w{width}/{image_path}.webp"


def render_entry(entry: dict[str, Any], args: argparse.Namespace) -> dict[str, Any]:
    ghost_path = entry["ghostPath"]
    source_path = local_source_path(entry["sourcePath"], args.source_root)
    current_path = args.asset_root / ghost_path.removeprefix("/")
    backup_path = BACKUP_ROOT / ghost_path.removeprefix("/")
    # Once --apply has run, always use the untouched Ghost backup as the visual
    # reference. This keeps subsequent runs idempotent and avoids re-encoding
    # or colour-grading against our own generated output.
    reference_path = backup_path if backup_path.is_file() else current_path
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    if not reference_path.is_file():
        raise FileNotFoundError(reference_path)

    source = load_source(str(source_path))
    reference = load_reference(reference_path)
    reference_height, reference_width = reference.shape[:2]
    matrix, alignment = homography(source, reference)
    alignment_method = "homography"

    if matrix is not None:
        source_pixels_per_reference = local_source_scale(matrix, reference_width, reference_height)
        output_scale = min(
            MAX_LONG_EDGE / max(reference_width, reference_height),
            source_pixels_per_reference * 0.97,
        )
        output_scale = max(1.0, output_scale)
        output_width = max(reference_width, round(reference_width * output_scale))
        output_height = max(reference_height, round(reference_height * output_scale))
        output_matrix = np.diag([output_width / reference_width, output_height / reference_height, 1.0]) @ matrix
        rendered = cv2.warpPerspective(
            source,
            output_matrix,
            (output_width, output_height),
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_REFLECT_101,
        )
        source_mask = np.full(source.shape[:2], 255, dtype=np.uint8)
        coverage_mask = cv2.warpPerspective(
            source_mask,
            output_matrix,
            (output_width, output_height),
            flags=cv2.INTER_NEAREST,
            borderMode=cv2.BORDER_CONSTANT,
        )
        coverage = float(np.count_nonzero(coverage_mask)) / coverage_mask.size
    else:
        alignment_method = "center-crop-fallback"
        cropped = centered_crop(source, reference_width, reference_height)
        crop_height, crop_width = cropped.shape[:2]
        output_scale = min(
            MAX_LONG_EDGE / max(reference_width, reference_height),
            crop_width / reference_width,
            crop_height / reference_height,
        )
        output_scale = max(1.0, output_scale)
        output_width = max(reference_width, round(reference_width * output_scale))
        output_height = max(reference_height, round(reference_height * output_scale))
        rendered = cv2.resize(cropped, (output_width, output_height), interpolation=cv2.INTER_LANCZOS4)
        coverage = 1.0

    rendered = colour_match(rendered, reference)
    rendered = local_tone_match(rendered, reference)
    rendered = sharpen(rendered)
    score = similarity(rendered, reference)
    output_path = args.output_root / ghost_path.removeprefix("/")
    save_image(rendered, output_path)

    variants: list[dict[str, Any]] = []
    for width in RESPONSIVE_WIDTHS:
        if width >= output_width:
            continue
        height = round(output_height * width / output_width)
        resized = cv2.resize(rendered, (width, height), interpolation=cv2.INTER_LANCZOS4)
        variant_ghost_path = responsive_paths(ghost_path, width)
        variant_path = args.output_root / variant_ghost_path.removeprefix("/")
        save_image(resized, variant_path, responsive=True)
        variants.append({
            "width": width,
            "height": height,
            "path": variant_ghost_path,
            "bytes": variant_path.stat().st_size,
        })

    return {
        "ghostPath": ghost_path,
        "postSlug": entry["postSlug"],
        "sourcePath": entry["sourcePath"],
        "matchMethod": entry["matchMethod"],
        "alignmentMethod": alignment_method,
        "alignment": alignment,
        "coverage": round(coverage, 5),
        "similarity": round(score, 5),
        "before": {
            "width": reference_width,
            "height": reference_height,
            "bytes": reference_path.stat().st_size,
        },
        "after": {
            "width": output_width,
            "height": output_height,
            "bytes": output_path.stat().st_size,
        },
        "responsive": variants,
    }


def apply_outputs(
    results: list[dict[str, Any]],
    args: argparse.Namespace,
    previous_derivatives: set[str],
) -> None:
    for result in results:
        paths = [result["ghostPath"], *[item["path"] for item in result["responsive"]]]

        for ghost_path in paths:
            relative = Path(ghost_path.removeprefix("/"))
            source = args.output_root / relative
            destination = args.asset_root / relative
            backup = BACKUP_ROOT / relative
            if destination.exists() and not backup.exists():
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(destination, backup)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)

    generated_derivatives = {
        item["path"]
        for result in results
        for item in result["responsive"]
    }
    for stale_path in previous_derivatives - generated_derivatives:
        # These paths were generated by an earlier applied run of this script.
        stale = args.asset_root / stale_path.removeprefix("/")
        if stale.exists() and stale.suffix.lower() == ".webp":
            stale.unlink()


def main() -> int:
    args = parse_args()
    previous_derivatives: set[str] = set()
    if args.report.exists():
        try:
            previous_report = json.loads(args.report.read_text())
            if previous_report.get("applied"):
                previous_derivatives = {
                    item["path"]
                    for image in previous_report.get("images", [])
                    for item in image.get("responsive", [])
                }
        except (json.JSONDecodeError, KeyError):
            pass
    manifest = json.loads(args.manifest.read_text())
    matched = [entry for entry in manifest["matches"] if entry.get("sourcePath")]
    if args.limit is not None:
        matched = matched[: args.limit]

    if args.output_root.exists():
        shutil.rmtree(args.output_root)
    args.output_root.mkdir(parents=True)

    results: list[dict[str, Any]] = []
    failures: list[dict[str, str]] = []
    for index, entry in enumerate(matched, start=1):
        try:
            result = render_entry(entry, args)
            results.append(result)
            print(
                f"[{index:03d}/{len(matched):03d}] {entry['ghostPath']} "
                f"{result['alignmentMethod']} {result['before']['width']}x{result['before']['height']} "
                f"-> {result['after']['width']}x{result['after']['height']} "
                f"similarity={result['similarity']:.3f}",
                flush=True,
            )
        except Exception as error:  # Continue to produce a complete audit report.
            failures.append({"ghostPath": entry["ghostPath"], "error": str(error)})
            print(f"[{index:03d}/{len(matched):03d}] FAILED {entry['ghostPath']}: {error}", file=sys.stderr, flush=True)

    if args.apply and not failures and len(results) == len(matched):
        apply_outputs(results, args, previous_derivatives)

    report = {
        "schemaVersion": 1,
        "manifest": str(args.manifest.relative_to(REPO_ROOT)),
        "rendered": len(results),
        "failed": len(failures),
        "applied": bool(args.apply and not failures and len(results) == len(matched)),
        "summary": {
            "homography": sum(item["alignmentMethod"] == "homography" for item in results),
            "centerCropFallback": sum(item["alignmentMethod"] != "homography" for item in results),
            "meanSimilarity": round(float(np.mean([item["similarity"] for item in results])), 5) if results else None,
            "minimumSimilarity": round(min((item["similarity"] for item in results), default=0), 5),
            "beforeBytes": sum(item["before"]["bytes"] for item in results),
            "afterBytes": sum(item["after"]["bytes"] for item in results),
        },
        "failures": failures,
        "images": results,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report["summary"], indent=2), flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
