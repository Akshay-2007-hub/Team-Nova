import cv2


def test_camera():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("ERROR: Cannot open webcam")
        return

    print("Webcam started. Press Q to close.")

    while True:
        success, frame = cap.read()

        if not success:
            print("ERROR: Cannot read webcam frame")
            break

        cv2.imshow("VayuMitra X - Webcam", frame)

        # Press Q to close webcam
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    test_camera()