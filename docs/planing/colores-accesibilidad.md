# Paleta de Colores y Accesibilidad

## Por qué estos colores

Al diseñar TechCup Sistemas, consideramos que aproximadamente el 8% de los hombres y el 0.5% de las mujeres tienen algún tipo de daltonismo. Nuestro principio fundamental fue: **ningún elemento depende únicamente del color para comunicar información**.

## Decisiones de color

### Verde Principal
Elegimos tonos verdes oscuros porque proporcionan excelente contraste sobre fondos claros (cumpliendo WCAG 2.1 nivel AA). Aunque el daltonismo rojo-verde es común, nuestro verde mantiene suficiente diferencia de brillo para ser distinguible. Además, el verde representa tecnología e innovación, alineándose con nuestra identidad digital.

### Azul Universal
El azul es el color más seguro para daltonismo - prácticamente todos pueden distinguirlo correctamente. Lo usamos en elementos secundarios y enlaces, aprovechando que los usuarios ya asocian el azul con interactividad.

### Amarillo y Naranja
Estos colores se distinguen por luminosidad, no por matiz. Incluso si el color exacto no se percibe bien, su alto brillo los hace visibles. Perfectos para alertas y notificaciones.

### Rojo con Contexto
El rojo nunca aparece solo. Siempre va acompañado de texto descriptivo ("Error", "Rechazado"), iconografía específica y posicionamiento consistente. Usamos un rojo con suficiente diferencia de brillo respecto al verde.

## Estrategias de accesibilidad

**Iconografía + Texto:** Cada botón incluye ícono Y texto. Los estados muestran etiquetas escritas.

**Contraste de Luminosidad:** Todas las combinaciones cumplen ratio mínimo 4.5:1. La interfaz funciona perfectamente en escala de grises.

**Estados Múltiples:** Los elementos interactivos usan múltiples señales: color + sombra + cursor + texto.

**Jerarquía Visual:** Tamaños diferenciados, espaciado consistente y agrupación clara hacen que la estructura sea comprensible sin depender del color.

## Tipos de daltonismo considerados

**Protanopía (ceguera al rojo):** Evitamos combinaciones rojo-verde sin contexto. Usamos diferencias de brillo.

**Deuteranopía (ceguera al verde):** El verde oscuro mantiene contraste de luminosidad. Elementos críticos usan azul o amarillo.

**Tritanopía (ceguera al azul):** Combinaciones azul-amarillo incluyen texto y formas distintivas.

**Acromatopsia (visión en escala de grises):** Toda la interfaz funciona en escala de grises gracias al contraste de luminosidad.

## Validación

Probamos cada pantalla con simuladores de daltonismo y analizadores de contraste. Resultados:
- 100% de elementos interactivos identificables sin percepción de color
- Ratio de contraste mínimo 4.5:1 en todo el texto
- Estados comunicados mediante 3+ señales visuales
- Navegación completamente funcional en escala de grises
