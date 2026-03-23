#!/bin/bash
echo "초등 공식 Manim 영상 렌더링 시작..."

cd manim_scripts/elementary

manim -qh e019_rectangle_area.py RectangleArea -o e019_rectangle_area.mp4
manim -qh e021_triangle_area.py TriangleArea -o e021_triangle_area.mp4
manim -qh e025_circle_area.py CircleArea -o e025_circle_area.mp4
manim -qh e030_triangle_angles.py TriangleAngles -o e030_triangle_angles.mp4
manim -qh e033_percentage.py Percentage -o e033_percentage.mp4

echo "렌더링 완료! public/videos/elementary/ 확인"
