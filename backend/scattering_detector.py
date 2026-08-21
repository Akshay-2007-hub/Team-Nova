import cv2
import numpy as np


def detect_scattering():

    # Open laptop webcam
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        return

    print("VayuMitra ScatterSense started")
    print("Press Q to close")

    while True:

        success, frame = cap.read()

        if not success:
            print("ERROR: Cannot read frame")
            break

        # Flip image for natural webcam view
        frame = cv2.flip(frame, 1)

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Slight blur to reduce camera noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Keep only bright pixels
        brightness_threshold = 200

        _, scattering_mask = cv2.threshold(
            blurred,
            brightness_threshold,
            255,
            cv2.THRESH_BINARY
        )

        # Remove small noise
        kernel = np.ones((3, 3), np.uint8)

        scattering_mask = cv2.morphologyEx(
            scattering_mask,
            cv2.MORPH_OPEN,
            kernel
        )

        # Find bright scattering regions
        contours, _ = cv2.findContours(
            scattering_mask,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        particle_count = 0

        for contour in contours:

            area = cv2.contourArea(contour)

            # Ignore tiny camera noise
            if area > 2:

                particle_count += 1

                x, y, w, h = cv2.boundingRect(contour)

                cv2.rectangle(
                    scattering_mask,
                    (x, y),
                    (x + w, y + h),
                    255,
                    1
                )

        # Add information to the black/white scattering display
        cv2.putText(
            scattering_mask,
            f"SCATTER PARTICLES: {particle_count}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            255,
            2
        )

        # Show original webcam
        cv2.imshow(
            "VayuMitra X - Original Webcam",
            frame
        )

        # Show only bright scattering on black background
        cv2.imshow(
            "VayuMitra X - ScatterSense",
            scattering_mask
        )

        # Press Q to exit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    detect_scattering()