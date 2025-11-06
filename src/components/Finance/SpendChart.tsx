import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { spacing as spacingTokens } from '../../theme/spacing';
import { useThemedColors } from '../../hooks/useThemedColors';

const screenWidth = Dimensions.get('window').width;

export type CategoryDatum = {
  name: string;
  amount: number;
  color: string;
};

type SpendChartProps = {
  data: CategoryDatum[];
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export const SpendChart: React.FC<SpendChartProps> = ({ data }) => {
  const colors = useThemedColors();
  const total = useMemo(() => data.reduce((s, d) => s + d.amount, 0) || 1, [data]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const labelColor = colors.textPrimary;
  const hintColor = colors.textSecondary;

  return (
    <View style={styles.wrapper}>
      {(() => {
        const size = screenWidth - spacingTokens.lg * 4;
        const outerR = size * 0.32;
        const innerR = outerR * 0.62;
        const cx = size / 2;
        const cy = 110; // visual balance
        let startAngle = 0;
        return (
          <Svg width={size} height={220} onPress={() => setSelectedIndex(null)}>
            <G>
              {data.map((d, i) => {
                const angle = (d.amount / total) * 360;
                const end = startAngle + angle;
                const large = angle > 180 ? 1 : 0;
                const startOuter = polarToCartesian(cx, cy, outerR, end);
                const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
                const startInner = polarToCartesian(cx, cy, innerR, end);
                const endInner = polarToCartesian(cx, cy, innerR, startAngle);
                const dPath = `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${large} 0 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${innerR} ${innerR} 0 ${large} 1 ${startInner.x} ${startInner.y} Z`;
                const isSelected = selectedIndex === i;
                startAngle = end;
                return (
                  <Path
                    key={i}
                    d={dPath}
                    fill={d.color}
                    opacity={isSelected || selectedIndex === null ? 1 : 0.35}
                    onPress={() => setSelectedIndex(i)}
                  />
                );
              })}
            </G>
          </Svg>
        );
      })()}
      <View pointerEvents="none" style={styles.centerLabel}> 
        {selectedIndex !== null ? (
          <>
            <Text style={[styles.centerName, { color: labelColor }]}>{data[selectedIndex].name}</Text>
            <Text style={[styles.centerPercent, { color: labelColor }]}>{Math.round((data[selectedIndex].amount / total) * 100)}%</Text>
          </>
        ) : (
          <Text style={[styles.centerHint, { color: hintColor }]}>Toque em uma categoria</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: spacingTokens.md },
  centerLabel: { position: 'absolute', top: 78, alignItems: 'center' },
  centerName: { fontSize: 14, fontWeight: '600' },
  centerPercent: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  centerHint: { fontSize: 12, opacity: 0.7 },
});

export default SpendChart;


