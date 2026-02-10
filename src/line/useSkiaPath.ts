import React, {useMemo} from 'react';
import {
    useSharedValue,
    useAnimatedReaction,
    SharedValue,
} from 'react-native-reanimated';
import {Skia} from '@shopify/react-native-skia';
import {PathObject} from '../utils';

interface UseSkiaPathParams {
    localPath: PathObject;
    derivedPathString?: SharedValue<any>;
}

export const useSkiaPath = ({
    localPath,
    derivedPathString,
}: UseSkiaPathParams) => {
    const staticSkiaPath = useMemo(() => {
        if (localPath?.d) {
            return Skia.Path.MakeFromSVGString(localPath.d);
        }
        return null;
    }, [localPath?.d]);

    const animatedSkiaPathSV = useSharedValue<ReturnType<
        typeof Skia.Path.MakeFromSVGString
    > | null>(staticSkiaPath);

    useAnimatedReaction(
        () => derivedPathString?.value,
        currentPathStr => {
            if (currentPathStr) {
                const p = Skia.Path.MakeFromSVGString(currentPathStr);
                if (p) {
                    animatedSkiaPathSV.value = p;
                }
            }
        },
        [derivedPathString],
    );

    React.useEffect(() => {
        if (!derivedPathString && staticSkiaPath) {
            animatedSkiaPathSV.value = staticSkiaPath;
        }
    }, [staticSkiaPath, derivedPathString]);

    const skiaPath = derivedPathString ? animatedSkiaPathSV : staticSkiaPath;

    return skiaPath;
};
