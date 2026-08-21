import cv2
import numpy as np
import json
import time


BASELINE_FILE = "baseline.json"


def extract_features(mask, previous_brightness):

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    particle_count = 0
    total_area = 0

    for contour in contours:

        area = cv2.contourArea(contour)

        if area > 2:
            particle_count += 1
            total_area += area

    brightness = float(np.mean(mask))

    total_pixels = mask.shape[0] * mask.shape[1]

    scatter_percentage = (
        np.count_nonzero(mask) / total_pixels
    ) * 100

    temporal_variation = abs(
        brightness - previous_brightness
    )

    return {
        "particle_count": particle_count,
        "scatter_percentage": scatter_percentage,
        "brightness": brightness,
        "temporal_variation": temporal_variation
    }


def calibrate_baseline():

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        return

    print("====================================")
    print("VAYUMITRA X BASELINE CALIBRATION")
    print("Keep the environment in NORMAL condition")
    print("Calibration will run for 15 seconds")
    print("Press Q to cancel")
    print("====================================")

    samples = []

    previous_brightness = 0

    start_time = time.time()

    calibration_time = 15

    while True:

        success, frame = cap.read()

        if not success:
            break

        frame = cv2.flip(frame, 1)

        gray = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2GRAY
        )

        blurred = cv2.GaussianBlur(
            gray,
            (5, 5),
            0
        )

        brightness_threshold = 200

        _, mask = cv2.threshold(
            blurred,
            brightness_threshold,
            255,
            cv2.THRESH_BINARY
        )

        kernel = np.ones((3, 3), np.uint8)

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_OPEN,
            kernel
        )

        features = extract_features(
            mask,
            previous_brightness
        )

        previous_brightness = features["brightness"]

        samples.append(features)

        elapsed = time.time() - start_time

        remaining = max(
            0,
            int(calibration_time - elapsed)
        )

        display = cv2.cvtColor(
            mask,
            cv2.COLOR_GRAY2BGR
        )

        cv2.putText(
            display,
            "VAYUMITRA X BASELINE LEARNING",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"CALIBRATING... {remaining}s",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"SAMPLES: {len(samples)}",
            (20, 120),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.imshow(
            "VayuMitra X - Baseline Calibration",
            display
        )

        if elapsed >= calibration_time:
            break

        if cv2.waitKey(1) & 0xFF == ord("q"):
            cap.release()
            cv2.destroyAllWindows()
            return

    cap.release()
    cv2.destroyAllWindows()

    # Calculate normal baseline averages
    baseline = {
        "particle_count": float(
            np.mean([
                s["particle_count"]
                for s in samples
            ])
        ),

        "scatter_percentage": float(
            np.mean([
                s["scatter_percentage"]
                for s in samples
            ])
        ),

        "brightness": float(
            np.mean([
                s["brightness"]
                for s in samples
            ])
        ),

        "temporal_variation": float(
            np.mean([
                s["temporal_variation"]
                for s in samples
            ])
        )
    }

    # Save baseline
    with open(
        BASELINE_FILE,
        "w"
    ) as file:

        json.dump(
            baseline,
            file,
            indent=4
        )

    print("\nBASELINE CALIBRATION COMPLETE\n")

    print(
        json.dumps(
            baseline,
            indent=4
        )
    )

    print(
        f"\nBaseline saved to {BASELINE_FILE}"
    )


if __name__ == "__main__":
    calibrate_baseline()