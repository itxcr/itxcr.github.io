# https://www.youtube.com/watch?v=WQeoO7MI0Bs
import cv2
import numpy as np

img = cv2.imread('1.jpg')
kernel = np.ones((5, 5))

imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
imgBlur = cv2.GaussianBlur(imgGray, (7, 7), 0)
imgCanny = cv2.Canny(img, 100, 100)
imgDilation = cv2.dilate(imgCanny, kernel, iterations=1)
imgEroded = cv2.erode(imgDilation, kernel, iterations=1)
cv2.imshow("Output", img)
cv2.imshow('Gray', imgGray)
cv2.imshow('Blur', imgBlur)
cv2.imshow('imgCanny', imgCanny)
cv2.imshow('imgDilation', imgDilation)
cv2.imshow('imgEroded', imgEroded)

cv2.waitKey(0)
