import cv2
import numpy as np
import time


def calculate_features(mask, contours, previous_brightness):

    particle_count = 0
    total_area = 0

    for contour in contours:
        area = cv2.contourArea(contour)

        if area > 2:
            particle_count += 1
            total_area += area

    # Average brightness of detected scattering image
    brightness = float(np.mean(mask))

    # Percentage of frame occupied by bright scattering
    total_pixels = mask.shape[0] * mask.shape[1]
    scatter_percentage = (np.count_nonzero(mask) / total_pixels) * 100

    # Frame-to-frame brightness variation
    temporal_variation = abs(brightness - previous_brightness)

    return {
        "particle_count": particle_count,
        "scatter_area": total_area,
        "brightness": brightness,
        "scatter_percentage": scatter_percentage,
        "temporal_variation": temporal_variation
    }


def calculate_anomaly_score(features):

    # Demo scoring model
    particle_score = min(features["particle_count"] / 50 * 25, 25)

    area_score = min(features["scatter_percentage"] * 5, 25)

    brightness_score = min(features["brightness"] / 255 * 25, 25)

    variation_score = min(
        features["temporal_variation"] / 20 * 25,
        25
    )

    anomaly_score = (
        particle_score
        + area_score
        + brightness_score
        + variation_score
    )

    return round(min(anomaly_score, 100), 1)


def run_vayumitra():

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        return

    print("VayuMitra X Optical Feature Engine Started")
    print("Press Q to close")

    previous_brightness = 0
    start_time = time.time()

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

        # Bright scattering threshold
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

        contours, _ = cv2.findContours(
            mask,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        features = calculate_features(
            mask,
            contours,
            previous_brightness
        )

        anomaly_score = calculate_anomaly_score(features)

        previous_brightness = features["brightness"]

        # Determine anomaly level
        if anomaly_score < 30:
            status = "NORMAL"
        elif anomaly_score < 60:
            status = "MODERATE"
        else:
            status = "HIGH"

        # Create a black background display
        display = cv2.cvtColor(
            mask,
            cv2.COLOR_GRAY2BGR
        )

        # Add feature information
        cv2.putText(
            display,
            f"PARTICLES: {features['particle_count']}",
            (20, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"SCATTER AREA: {features['scatter_percentage']:.2f}%",
            (20, 65),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"TEMP VARIATION: {features['temporal_variation']:.2f}",
            (20, 95),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"OPTICAL ANOMALY: {anomaly_score}/100",
            (20, 125),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            display,
            f"STATUS: {status}",
            (20, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )

        cv2.imshow(
            "VayuMitra X - Optical Scatter Intelligence",
            display
        )

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_vayumitra()