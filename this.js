<Group>
  {/* Base soft background */}
  <Rect
    x={0}
    y={0}
    width={400}
    height={400}
    fillPriority="radial-gradient"
    fillRadialGradientStartPoint={{ x: 200, y: 200 }}
    fillRadialGradientEndPoint={{ x: 200, y: 200 }}
    fillRadialGradientStartRadius={0}
    fillRadialGradientEndRadius={400}
    fillRadialGradientColorStops={[
      0, "rgba(250, 248, 245, 1)",   // off-white
      0.4, "rgba(235, 232, 230, 1)", // cream
      1, "rgba(240, 240, 240, 1)",   // light gray
    ]}
  />

  {/* Scattered gradient 1 */}
  <Circle
    x={120}
    y={150}
    radius={180}
    fillPriority="radial-gradient"
    fillRadialGradientStartPoint={{ x: 120, y: 150 }}
    fillRadialGradientEndPoint={{ x: 120, y: 150 }}
    fillRadialGradientStartRadius={0}
    fillRadialGradientEndRadius={180}
    fillRadialGradientColorStops={[
      0, "rgba(205, 185, 220, 0.6)", // lavender hint
      1, "rgba(255, 255, 255, 0)",   // fade out
    ]}
  />

  {/* Scattered gradient 2 */}
  <Circle
    x={300}
    y={250}
    radius={220}
    fillPriority="radial-gradient"
    fillRadialGradientStartPoint={{ x: 300, y: 250 }}
    fillRadialGradientEndPoint={{ x: 300, y: 250 }}
    fillRadialGradientStartRadius={0}
    fillRadialGradientEndRadius={220}
    fillRadialGradientColorStops={[
      0, "rgba(200, 220, 210, 0.5)", // muted sage contrast
      1, "rgba(255, 255, 255, 0)",   // fade out
    ]}
  />
</Group>
