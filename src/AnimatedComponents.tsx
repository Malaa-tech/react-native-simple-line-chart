import Animated from 'react-native-reanimated';
import { Circle, G, Path } from 'react-native-svg';

export const AnimatedView = Animated.View;
export const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedG = Animated.createAnimatedComponent(G);
