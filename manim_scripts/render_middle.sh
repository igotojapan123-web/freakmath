#!/bin/bash
echo "중등 공식 Manim 영상 렌더링..."

cd manim_scripts/middle

manim -qh m045_pythagoras.py PythagorasProof -o m045_pythagoras.mp4
manim -qh m028_quadratic_formula.py QuadraticFormula -o m028_quadratic_formula.mp4
manim -qh m054_trig_intro.py TrigIntro -o m054_trig_intro.mp4
manim -qh m018_binomial_square.py BinomialSquare -o m018_binomial_square.mp4

echo "완료! public/videos/middle/ 확인"
