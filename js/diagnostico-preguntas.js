const DIAGNOSTICO_PREGUNTAS = [
    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 1: Operaciones y álgebra básica (Q1-Q6)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 1, tipo: 'opcion_multiple',
        subtema: 'Operaciones y álgebra básica',
        pregunta: '¿Cuál es el resultado de (-3)² + 2(-3) - 5?',
        opciones: ['-2', '2', '-8', '8'],
        respuesta: 0,
        explicacion: '(-3)² = 9, luego 2(-3) = -6. Entonces: 9 + (-6) - 5 = 9 - 6 - 5 = -2.'
    },
    {
        id: 2, tipo: 'opcion_multiple',
        subtema: 'Operaciones y álgebra básica',
        pregunta: 'Simplifica: (2x³)(3x²)',
        opciones: ['6x⁵', '5x⁵', '6x⁶', '5x⁶'],
        respuesta: 0,
        explicacion: 'Se multiplican los coeficientes: 2 × 3 = 6. Se suman los exponentes: x³⁺² = x⁵. Resultado: 6x⁵.'
    },
    {
        id: 3, tipo: 'opcion_multiple',
        subtema: 'Operaciones y álgebra básica',
        pregunta: '¿Cuál es el resultado de 3/4 + 2/3?',
        opciones: ['17/12', '5/7', '5/12', '1'],
        respuesta: 0,
        explicacion: 'MCM de 4 y 3 es 12. Entonces: 9/12 + 8/12 = 17/12.'
    },
    {
        id: 4, tipo: 'seleccion_multiple',
        subtema: 'Operaciones y álgebra básica',
        pregunta: '¿Cuáles de las siguientes expresiones son equivalentes a 2(x + 3)? (Selecciona todas las correctas)',
        opciones: ['2x + 6', '2x + 3', 'x + x + 6', '2x + 2 · 3'],
        respuestas: [0, 2, 3],
        explicacion: '2(x+3) = 2x + 6. También x + x + 6 = 2x + 6 ✓ y 2x + 2·3 = 2x + 6 ✓. Pero 2x + 3 ≠ 2x + 6.'
    },
    {
        id: 5, tipo: 'emparejamiento',
        subtema: 'Operaciones y álgebra básica',
        pregunta: 'Empareja cada operación con su resultado:',
        columna_a: ['2³', '√49', '|-5|', '3!'],
        columna_b: ['8', '7', '5', '6'],
        pares: [0, 1, 2, 3],
        explicacion: '2³ = 8, √49 = 7, |-5| = 5, 3! = 3×2×1 = 6.'
    },
    {
        id: 6, tipo: 'completar_numero',
        subtema: 'Operaciones y álgebra básica',
        pregunta: 'Si a = 4 y b = -3, calcula el valor de a² - 2ab + b². Escribe solo el número.',
        respuesta: 49,
        explicacion: 'a² - 2ab + b² = 16 - 2(4)(-3) + 9 = 16 + 24 + 9 = 49. También es (a - b)² = (4-(-3))² = 7² = 49.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 2: Ecuaciones y factorización (Q7-Q12)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 7, tipo: 'opcion_multiple',
        subtema: 'Ecuaciones y factorización',
        pregunta: 'Resuelve la ecuación: 3x - 7 = 2x + 5',
        opciones: ['x = 12', 'x = -12', 'x = 2', 'x = -2'],
        respuesta: 0,
        explicacion: '3x - 2x = 5 + 7 → x = 12.'
    },
    {
        id: 8, tipo: 'opcion_multiple',
        subtema: 'Ecuaciones y factorización',
        pregunta: '¿Cuál es la factorización de x² - 9?',
        opciones: ['(x + 3)(x - 3)', '(x - 3)²', '(x + 9)(x - 1)', '(x + 3)²'],
        respuesta: 0,
        explicacion: 'x² - 9 es una diferencia de cuadrados: a² - b² = (a+b)(a-b). Entonces x² - 9 = (x+3)(x-3).'
    },
    {
        id: 9, tipo: 'opcion_multiple',
        subtema: 'Ecuaciones y factorización',
        pregunta: '¿Cuáles son las soluciones de x² - 5x + 6 = 0?',
        opciones: ['x = 2 y x = 3', 'x = -2 y x = -3', 'x = 1 y x = 6', 'x = -1 y x = -6'],
        respuesta: 0,
        explicacion: 'x² - 5x + 6 = (x - 2)(x - 3) = 0. Entonces x = 2 o x = 3.'
    },
    {
        id: 10, tipo: 'seleccion_multiple',
        subtema: 'Ecuaciones y factorización',
        pregunta: '¿Cuáles de las siguientes factorizaciones son correctas? (Selecciona todas las correctas)',
        opciones: ['x² - 4 = (x + 2)(x - 2)', 'x² + 6x + 9 = (x + 3)²', 'x² - x - 6 = (x + 2)(x - 3)', 'x² + 4 = (x + 2)²'],
        respuestas: [0, 1, 2],
        explicacion: 'Las tres primeras son correctas. La última es falsa: (x+2)² = x² + 4x + 4 ≠ x² + 4.'
    },
    {
        id: 11, tipo: 'emparejamiento',
        subtema: 'Ecuaciones y factorización',
        pregunta: 'Empareja cada expresión con su forma factorizada:',
        columna_a: ['x² - 16', 'x² + 8x + 16', 'x² - 8x + 16', '2x² + 4x'],
        columna_b: ['(x+4)(x-4)', '(x+4)²', '(x-4)²', '2x(x+2)'],
        pares: [0, 1, 2, 3],
        explicacion: 'x²-16 = (x+4)(x-4), x²+8x+16 = (x+4)², x²-8x+16 = (x-4)², 2x²+4x = 2x(x+2).'
    },
    {
        id: 12, tipo: 'completar_numero',
        subtema: 'Ecuaciones y factorización',
        pregunta: 'Si 2x + 8 = 0, ¿cuánto vale x? Escribe solo el número.',
        respuesta: -4,
        explicacion: '2x + 8 = 0 → 2x = -8 → x = -4.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 3: Funciones y modelos matemáticos (Q13-Q18)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 13, tipo: 'opcion_multiple',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: 'Si f(x) = 3x - 2, ¿cuánto vale f(4)?',
        opciones: ['10', '14', '8', '6'],
        respuesta: 0,
        explicacion: 'f(4) = 3(4) - 2 = 12 - 2 = 10.'
    },
    {
        id: 14, tipo: 'opcion_multiple',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: '¿Cuál es el dominio de f(x) = √(x - 3)?',
        opciones: ['x ≥ 3', 'x > 3', 'x ≥ 0', 'Todos los reales'],
        respuesta: 0,
        explicacion: 'Para que la raíz cuadrada exista, x - 3 ≥ 0, es decir x ≥ 3.'
    },
    {
        id: 15, tipo: 'opcion_multiple',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: 'La gráfica de y = x² es una:',
        opciones: ['Parábola', 'Recta', 'Hipérbola', 'Circunferencia'],
        respuesta: 0,
        explicacion: 'y = x² es una función cuadrática cuya gráfica es una parábola que abre hacia arriba.'
    },
    {
        id: 16, tipo: 'opcion_multiple',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: 'Si f(x) = 2x + 1 y g(x) = x², ¿cuánto vale g(f(1))?',
        opciones: ['9', '5', '7', '3'],
        respuesta: 0,
        explicacion: 'Primero f(1) = 2(1) + 1 = 3. Luego g(3) = 3² = 9.'
    },
    {
        id: 17, tipo: 'seleccion_multiple',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: '¿Cuáles son características de f(x) = -2x² + 4x - 1? (Selecciona todas las correctas)',
        opciones: ['Es una parábola', 'Abre hacia abajo', 'Su vértice es un punto mínimo', 'Corta al eje Y en y = -1'],
        respuestas: [0, 1, 3],
        explicacion: 'Es cuadrática (parábola). Como el coeficiente de x² es negativo, abre hacia abajo y su vértice es un máximo, no un mínimo. f(0) = -1, así que corta al eje Y en -1.'
    },
    {
        id: 18, tipo: 'emparejamiento',
        subtema: 'Funciones y modelos matemáticos',
        pregunta: 'Empareja cada función con su tipo:',
        columna_a: ['f(x) = 5x - 3', 'f(x) = x² + 1', 'f(x) = 2ˣ', 'f(x) = 1/x'],
        columna_b: ['Lineal', 'Cuadrática', 'Exponencial', 'Racional'],
        pares: [0, 1, 2, 3],
        explicacion: '5x-3 es lineal, x²+1 es cuadrática, 2ˣ es exponencial, 1/x es racional.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 4: Sucesiones, regla de tres y proporcionalidad (Q19-Q24)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 19, tipo: 'opcion_multiple',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: '¿Cuál es el siguiente término de la sucesión 2, 6, 18, 54, ...?',
        opciones: ['162', '108', '72', '216'],
        respuesta: 0,
        explicacion: 'Es una sucesión geométrica con razón 3. El siguiente término es 54 × 3 = 162.'
    },
    {
        id: 20, tipo: 'opcion_multiple',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: 'Si 5 obreros construyen un muro en 12 días, ¿en cuántos días lo construirán 10 obreros?',
        opciones: ['6 días', '24 días', '3 días', '10 días'],
        respuesta: 0,
        explicacion: 'Es inversamente proporcional: 5 × 12 = 10 × x → x = 60/10 = 6 días.'
    },
    {
        id: 21, tipo: 'opcion_multiple',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: 'Si 3 kg de manzanas cuestan $4.50, ¿cuánto cuestan 8 kg?',
        opciones: ['$12.00', '$10.50', '$13.50', '$9.00'],
        respuesta: 0,
        explicacion: 'Regla de tres directa: (8 × 4.50) / 3 = 36 / 3 = $12.00.'
    },
    {
        id: 22, tipo: 'seleccion_multiple',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: '¿Cuáles de las siguientes son sucesiones aritméticas? (Selecciona todas las correctas)',
        opciones: ['2, 5, 8, 11, ...', '1, 2, 4, 8, ...', '10, 7, 4, 1, ...', '3, 6, 12, 24, ...'],
        respuestas: [0, 2],
        explicacion: '2,5,8,11 tiene diferencia constante d=3 (aritmética). 10,7,4,1 tiene d=-3 (aritmética). Las otras son geométricas.'
    },
    {
        id: 23, tipo: 'emparejamiento',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: 'Empareja cada sucesión con su regla:',
        columna_a: ['1, 4, 7, 10, ...', '2, 4, 8, 16, ...', '5, 5, 5, 5, ...', '1, 1, 2, 3, 5, ...'],
        columna_b: ['aₙ = 3n - 2', 'aₙ = 2ⁿ', 'aₙ = 5', 'Fibonacci'],
        pares: [0, 1, 2, 3],
        explicacion: '3n-2 da 1,4,7,10. 2ⁿ da 2,4,8,16. aₙ=5 da la constante. La otra es Fibonacci.'
    },
    {
        id: 24, tipo: 'completar_numero',
        subtema: 'Sucesiones, regla de tres y proporcionalidad',
        pregunta: '¿Cuál es el término número 10 de la sucesión aritmética 3, 7, 11, 15, ...? Escribe solo el número.',
        respuesta: 39,
        explicacion: 'a₁ = 3, d = 4. a₁₀ = 3 + (10-1)×4 = 3 + 36 = 39.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 5: Geometría analítica básica (Q25-Q30)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 25, tipo: 'opcion_multiple',
        subtema: 'Geometría analítica básica',
        pregunta: '¿Cuál es la distancia entre los puntos A(1, 2) y B(4, 6)?',
        opciones: ['5', '7', '√13', '25'],
        respuesta: 0,
        explicacion: 'd = √((4-1)² + (6-2)²) = √(9 + 16) = √25 = 5.'
    },
    {
        id: 26, tipo: 'opcion_multiple',
        subtema: 'Geometría analítica básica',
        pregunta: '¿Cuál es la pendiente de la recta que pasa por los puntos (2, 3) y (6, 11)?',
        opciones: ['2', '1/2', '4', '-2'],
        respuesta: 0,
        explicacion: 'm = (11 - 3) / (6 - 2) = 8 / 4 = 2.'
    },
    {
        id: 27, tipo: 'opcion_multiple',
        subtema: 'Geometría analítica básica',
        pregunta: '¿Cuál es el área de un triángulo con base 10 cm y altura 6 cm?',
        opciones: ['30 cm²', '60 cm²', '16 cm²', '20 cm²'],
        respuesta: 0,
        explicacion: 'Área = (base × altura) / 2 = (10 × 6) / 2 = 30 cm².'
    },
    {
        id: 28, tipo: 'seleccion_multiple',
        subtema: 'Geometría analítica básica',
        pregunta: '¿Cuáles afirmaciones son correctas sobre un círculo de radio 5? (Selecciona todas las correctas)',
        opciones: ['Su diámetro es 10', 'Su perímetro es 10π', 'Su área es 25π', 'Su área es 10π'],
        respuestas: [0, 1, 2],
        explicacion: 'Diámetro = 2r = 10. Perímetro = 2πr = 10π. Área = πr² = 25π. 10π no es el área.'
    },
    {
        id: 29, tipo: 'emparejamiento',
        subtema: 'Geometría analítica básica',
        pregunta: 'Empareja cada fórmula con la figura geométrica correspondiente:',
        columna_a: ['A = πr²', 'P = 4l', 'A = (b × h) / 2', 'P = 2(a + b)'],
        columna_b: ['Área del círculo', 'Perímetro del cuadrado', 'Área del triángulo', 'Perímetro del rectángulo'],
        pares: [0, 1, 2, 3],
        explicacion: 'πr² es el área del círculo, 4l el perímetro del cuadrado, (b×h)/2 el área del triángulo, 2(a+b) el perímetro del rectángulo.'
    },
    {
        id: 30, tipo: 'completar_numero',
        subtema: 'Geometría analítica básica',
        pregunta: '¿Cuál es el perímetro (en cm) de un cuadrado cuya área es 64 cm²? Escribe solo el número.',
        respuesta: 32,
        explicacion: 'Lado = √64 = 8 cm. Perímetro = 4 × 8 = 32 cm.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 6: Matemáticas financieras (Q31-Q36)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 31, tipo: 'opcion_multiple',
        subtema: 'Matemáticas financieras',
        pregunta: '¿Cuál es el interés simple de un capital de $2000 al 5% anual durante 3 años?',
        opciones: ['$300', '$315.25', '$250', '$600'],
        respuesta: 0,
        explicacion: 'I = C × r × t = 2000 × 0.05 × 3 = $300.'
    },
    {
        id: 32, tipo: 'opcion_multiple',
        subtema: 'Matemáticas financieras',
        pregunta: 'Si un artículo cuesta $80 y tiene un descuento del 25%, ¿cuánto se paga?',
        opciones: ['$60', '$55', '$65', '$20'],
        respuesta: 0,
        explicacion: 'Descuento = 80 × 0.25 = $20. Precio final = 80 - 20 = $60.'
    },
    {
        id: 33, tipo: 'opcion_multiple',
        subtema: 'Matemáticas financieras',
        pregunta: 'Un producto costaba $40 y ahora cuesta $50. ¿Cuál fue el porcentaje de incremento?',
        opciones: ['25%', '20%', '10%', '50%'],
        respuesta: 0,
        explicacion: 'Incremento = (50-40)/40 × 100 = 10/40 × 100 = 25%.'
    },
    {
        id: 34, tipo: 'opcion_multiple',
        subtema: 'Matemáticas financieras',
        pregunta: 'Si inviertes $1000 al 10% de interés compuesto anual durante 2 años, ¿cuánto tendrás?',
        opciones: ['$1210', '$1200', '$1100', '$1331'],
        respuesta: 0,
        explicacion: 'M = 1000 × (1.10)² = 1000 × 1.21 = $1210.'
    },
    {
        id: 35, tipo: 'seleccion_multiple',
        subtema: 'Matemáticas financieras',
        pregunta: '¿Cuáles afirmaciones son correctas sobre el interés? (Selecciona todas las correctas)',
        opciones: ['El interés simple crece linealmente con el tiempo', 'El interés compuesto genera intereses sobre los intereses', 'El interés simple siempre genera más ganancia que el compuesto', 'A mayor tasa, mayor interés generado'],
        respuestas: [0, 1, 3],
        explicacion: 'El interés simple es lineal, el compuesto genera interés sobre interés, y a mayor tasa mayor ganancia. El compuesto siempre supera al simple a largo plazo.'
    },
    {
        id: 36, tipo: 'completar_numero',
        subtema: 'Matemáticas financieras',
        pregunta: 'Si compras un producto de $200 con IVA del 15%, ¿cuánto pagas en total? Escribe solo el número.',
        respuesta: 230,
        explicacion: 'Total = 200 × 1.15 = $230.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 7: Estadística, probabilidad y análisis de datos (Q37-Q42)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 37, tipo: 'opcion_multiple',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: '¿Cuál es la media aritmética de los datos: 4, 7, 3, 8, 3?',
        opciones: ['5', '3', '7', '4'],
        respuesta: 0,
        explicacion: 'Media = (4 + 7 + 3 + 8 + 3) / 5 = 25 / 5 = 5.'
    },
    {
        id: 38, tipo: 'opcion_multiple',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: '¿Cuál es la mediana de: 12, 5, 8, 3, 15?',
        opciones: ['8', '5', '12', '8.6'],
        respuesta: 0,
        explicacion: 'Ordenados: 3, 5, 8, 12, 15. La mediana (valor central) es 8.'
    },
    {
        id: 39, tipo: 'opcion_multiple',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: 'Si se lanza un dado justo, ¿cuál es la probabilidad de obtener un número par?',
        opciones: ['1/2', '1/3', '1/6', '2/3'],
        respuesta: 0,
        explicacion: 'Números pares en un dado: 2, 4, 6 (3 de 6 posibles). P = 3/6 = 1/2.'
    },
    {
        id: 40, tipo: 'seleccion_multiple',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: '¿Cuáles de los siguientes son medidas de tendencia central? (Selecciona todas las correctas)',
        opciones: ['Media', 'Mediana', 'Moda', 'Rango'],
        respuestas: [0, 1, 2],
        explicacion: 'Media, mediana y moda son medidas de tendencia central. El rango es una medida de dispersión.'
    },
    {
        id: 41, tipo: 'emparejamiento',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: 'Empareja cada concepto estadístico con su definición:',
        columna_a: ['Media', 'Mediana', 'Moda', 'Rango'],
        columna_b: ['Suma de datos dividida entre la cantidad', 'Valor central al ordenar los datos', 'Dato que más se repite', 'Diferencia entre el mayor y el menor'],
        pares: [0, 1, 2, 3],
        explicacion: 'Media = promedio, Mediana = valor central, Moda = más frecuente, Rango = máx - mín.'
    },
    {
        id: 42, tipo: 'completar_numero',
        subtema: 'Estadística, probabilidad y análisis de datos',
        pregunta: '¿Cuál es la moda de los datos: 2, 3, 5, 3, 8, 3, 7? Escribe solo el número.',
        respuesta: 3,
        explicacion: 'El número 3 aparece 3 veces (más que cualquier otro). La moda es 3.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 8: Lógica proposicional y patrones lógico-abstractos (Q43-Q48)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 43, tipo: 'opcion_multiple',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: 'Si p es verdadero y q es falso, ¿cuál es el valor de verdad de p ∧ q?',
        opciones: ['Falso', 'Verdadero', 'No se puede determinar', 'Depende del contexto'],
        respuesta: 0,
        explicacion: 'La conjunción (∧) solo es verdadera cuando ambas proposiciones son verdaderas. V ∧ F = F.'
    },
    {
        id: 44, tipo: 'opcion_multiple',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: '¿Cuál es la negación de "Todos los gatos son negros"?',
        opciones: ['Existe al menos un gato que no es negro', 'Ningún gato es negro', 'Todos los gatos son blancos', 'Algunos gatos son negros'],
        respuesta: 0,
        explicacion: 'La negación de "todos" es "existe al menos uno que no". ¬(∀x P(x)) = ∃x ¬P(x).'
    },
    {
        id: 45, tipo: 'opcion_multiple',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: '¿Cuál es el siguiente número en la secuencia: 1, 4, 9, 16, ...?',
        opciones: ['25', '20', '36', '21'],
        respuesta: 0,
        explicacion: 'Son los cuadrados perfectos: 1², 2², 3², 4². El siguiente es 5² = 25.'
    },
    {
        id: 46, tipo: 'opcion_multiple',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: 'Si "p → q" es verdadero y p es verdadero, ¿qué podemos concluir sobre q?',
        opciones: ['q es verdadero', 'q es falso', 'q es indeterminado', 'Depende de q'],
        respuesta: 0,
        explicacion: 'Por Modus Ponens: si p → q es verdadero y p es verdadero, entonces q necesariamente es verdadero.'
    },
    {
        id: 47, tipo: 'seleccion_multiple',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: '¿Cuáles de las siguientes son proposiciones lógicas? (Selecciona todas las correctas)',
        opciones: ['"El cielo es azul"', '"¿Qué hora es?"', '"5 + 3 = 8"', '"¡Cierra la puerta!"'],
        respuestas: [0, 2],
        explicacion: 'Una proposición tiene valor de verdad (V o F). Las preguntas y los imperativos no son proposiciones.'
    },
    {
        id: 48, tipo: 'emparejamiento',
        subtema: 'Lógica proposicional y patrones lógico-abstractos',
        pregunta: 'Empareja cada conectivo lógico con su símbolo:',
        columna_a: ['Conjunción (Y)', 'Disyunción (O)', 'Negación (NO)', 'Condicional (Si...entonces)'],
        columna_b: ['∧', '∨', '¬', '→'],
        pares: [0, 1, 2, 3],
        explicacion: 'Conjunción = ∧, Disyunción = ∨, Negación = ¬, Condicional = →.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 9: Inferencias válidas, falacias y análisis de problemas (Q49-Q54)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 49, tipo: 'opcion_multiple',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: '"Si llueve, entonces la calle se moja. La calle no está mojada." ¿Qué se puede concluir?',
        opciones: ['No llueve', 'Llueve', 'La calle está mojada', 'No se puede concluir nada'],
        respuesta: 0,
        explicacion: 'Por Modus Tollens: si p → q y ¬q, entonces ¬p. No llueve.'
    },
    {
        id: 50, tipo: 'opcion_multiple',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: '¿Qué tipo de falacia es: "No le creas a Juan sobre nutrición porque él no es médico"?',
        opciones: ['Argumento ad hominem', 'Falacia de generalización', 'Falsa causa', 'Falacia del hombre de paja'],
        respuesta: 0,
        explicacion: 'Es un argumento ad hominem: se ataca a la persona en lugar de refutar su argumento.'
    },
    {
        id: 51, tipo: 'opcion_multiple',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: '"Todos los perros son mamíferos. Rex es un perro." ¿Qué se puede concluir?',
        opciones: ['Rex es un mamífero', 'Rex no es mamífero', 'No se puede concluir nada', 'Todos los mamíferos son perros'],
        respuesta: 0,
        explicacion: 'Silogismo válido: si todos los A son B y X es A, entonces X es B. Rex es mamífero.'
    },
    {
        id: 52, tipo: 'opcion_multiple',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: 'Si el conjunto A está contenido en B, y B está contenido en C, entonces:',
        opciones: ['A está contenido en C', 'C está contenido en A', 'A es igual a C', 'No hay relación entre A y C'],
        respuesta: 0,
        explicacion: 'Por la propiedad transitiva de la inclusión de conjuntos: A ⊂ B y B ⊂ C implica A ⊂ C.'
    },
    {
        id: 53, tipo: 'seleccion_multiple',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: 'A partir de "Si estudio, entonces apruebo" y "Estudio", ¿cuáles conclusiones son válidas? (Selecciona todas)',
        opciones: ['Apruebo', 'No estudio', 'Si no apruebo, entonces no estudié', 'Si apruebo, entonces estudié'],
        respuestas: [0, 2],
        explicacion: 'Por Modus Ponens: Apruebo ✓. La contrarrecíproca (si ¬q entonces ¬p) también es válida ✓. La cuarta es afirmación del consecuente (falacia).'
    },
    {
        id: 54, tipo: 'emparejamiento',
        subtema: 'Inferencias válidas y análisis de problemas',
        pregunta: 'Empareja cada tipo de razonamiento con su ejemplo:',
        columna_a: ['Deductivo', 'Inductivo', 'Analógico', 'Por el absurdo'],
        columna_b: ['"Todo A es B, X es A, luego X es B"', '"He visto 100 cisnes blancos, todos los cisnes deben ser blancos"', '"El corazón es al cuerpo como el motor al auto"', '"Si suponemos lo contrario, llegamos a una contradicción"'],
        pares: [0, 1, 2, 3],
        explicacion: 'Deductivo = de lo general a lo particular. Inductivo = de casos a generalización. Analógico = por semejanza. Absurdo = suponer lo contrario y hallar contradicción.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 10: Pensamiento computacional y utilitarios digitales (Q55-Q60)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 55, tipo: 'opcion_multiple',
        subtema: 'Pensamiento computacional',
        pregunta: 'En un diagrama de flujo, ¿qué forma geométrica representa una decisión (condición)?',
        opciones: ['Rombo', 'Rectángulo', 'Óvalo', 'Paralelogramo'],
        respuesta: 0,
        explicacion: 'En diagramas de flujo, el rombo representa una decisión/condición, el rectángulo un proceso, el óvalo inicio/fin, y el paralelogramo entrada/salida.'
    },
    {
        id: 56, tipo: 'opcion_multiple',
        subtema: 'Pensamiento computacional',
        pregunta: '¿Cuál es la representación binaria del número decimal 10?',
        opciones: ['1010', '1100', '1001', '1110'],
        respuesta: 0,
        explicacion: '10 en binario: 10 = 8+2 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 1010.'
    },
    {
        id: 57, tipo: 'opcion_multiple',
        subtema: 'Pensamiento computacional',
        pregunta: '¿Cuál es el resultado del siguiente algoritmo? x = 5; x = x + 3; x = x × 2',
        opciones: ['16', '13', '10', '21'],
        respuesta: 0,
        explicacion: 'x = 5, luego x = 5+3 = 8, luego x = 8×2 = 16.'
    },
    {
        id: 58, tipo: 'opcion_multiple',
        subtema: 'Pensamiento computacional',
        pregunta: '¿Qué tipo de dato se utiliza para almacenar texto en programación?',
        opciones: ['String (cadena)', 'Integer (entero)', 'Boolean (lógico)', 'Float (decimal)'],
        respuesta: 0,
        explicacion: 'String almacena texto, Integer números enteros, Boolean verdadero/falso, Float decimales.'
    },
    {
        id: 59, tipo: 'completar_numero',
        subtema: 'Pensamiento computacional',
        pregunta: 'Convierte el número binario 1101 a decimal. Escribe solo el número.',
        respuesta: 13,
        explicacion: '1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13.'
    },
    {
        id: 60, tipo: 'emparejamiento',
        subtema: 'Pensamiento computacional',
        pregunta: 'Empareja cada concepto de programación con su definición:',
        columna_a: ['Algoritmo', 'Variable', 'Bucle', 'Condicional'],
        columna_b: ['Secuencia de pasos para resolver un problema', 'Espacio de memoria que almacena un dato', 'Estructura que repite instrucciones', 'Estructura que evalúa una condición'],
        pares: [0, 1, 2, 3],
        explicacion: 'Algoritmo = pasos ordenados, Variable = almacena datos, Bucle = repetición, Condicional = decisión.'
    }
];
