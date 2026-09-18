const PREGUNTAS_MATEMATICAS = [
  // =====================================================
  // SUBTEMA 1: Operaciones y álgebra básica (5 preguntas)
  // =====================================================
  {
    id: 1,
    area: "matematicas",
    subtema: "Operaciones y álgebra básica",
    pregunta: "¿Cuál es el resultado de (3/4 + 2/3) ÷ (1/2)?",
    opciones: ["17/6", "5/12", "17/12", "34/6"],
    respuesta: 0,
    explicacion: "Primero sumamos: 3/4 + 2/3 = 9/12 + 8/12 = 17/12. Luego dividimos entre 1/2: (17/12) ÷ (1/2) = (17/12) × (2/1) = 34/12 = 17/6."
  },
  {
    id: 2,
    area: "matematicas",
    subtema: "Operaciones y álgebra básica",
    pregunta: "Calcule: (-3)² + (-2)³ − √49",
    opciones: ["10", "−6", "8", "−2"],
    respuesta: 1,
    explicacion: "(-3)² = 9; (-2)³ = -8; √49 = 7. Entonces: 9 + (-8) − 7 = 9 − 8 − 7 = −6."
  },
  {
    id: 3,
    area: "matematicas",
    subtema: "Operaciones y álgebra básica",
    pregunta: "Simplifique: 2³ × 2⁴ ÷ 2⁵",
    opciones: ["2", "4", "8", "16"],
    respuesta: 1,
    explicacion: "Aplicando propiedades de exponentes: 2³ × 2⁴ = 2⁷; luego 2⁷ ÷ 2⁵ = 2^(7−5) = 2² = 4."
  },
  {
    id: 4,
    area: "matematicas",
    subtema: "Operaciones y álgebra básica",
    pregunta: "¿Cuál es el valor de |−5 + 3| + |4 − 7|?",
    opciones: ["4", "6", "5", "3"],
    respuesta: 2,
    explicacion: "|−5 + 3| = |−2| = 2; |4 − 7| = |−3| = 3. Sumando: 2 + 3 = 5."
  },
  {
    id: 5,
    area: "matematicas",
    subtema: "Operaciones y álgebra básica",
    pregunta: "Simplifique la expresión: (x³ · x²) / x⁴",
    opciones: ["x⁵", "x", "x²", "1/x"],
    respuesta: 1,
    explicacion: "En el numerador: x³ · x² = x⁵. Luego x⁵ / x⁴ = x^(5−4) = x¹ = x."
  },

  // =====================================================
  // SUBTEMA 2: Ecuaciones y factorización (5 preguntas)
  // =====================================================
  {
    id: 6,
    area: "matematicas",
    subtema: "Ecuaciones y factorización",
    pregunta: "Resuelva la ecuación: 3x − 7 = 2x + 5",
    opciones: ["x = 2", "x = 12", "x = −2", "x = 6"],
    respuesta: 1,
    explicacion: "Restamos 2x de ambos lados: x − 7 = 5. Sumamos 7: x = 12. Verificación: 3(12) − 7 = 29 y 2(12) + 5 = 29."
  },
  {
    id: 7,
    area: "matematicas",
    subtema: "Ecuaciones y factorización",
    pregunta: "¿Cuál es la factorización de x² − 9?",
    opciones: ["(x − 3)²", "(x + 9)(x − 1)", "(x + 3)(x − 3)", "(x − 9)(x + 1)"],
    respuesta: 2,
    explicacion: "Es una diferencia de cuadrados: x² − 9 = x² − 3² = (x + 3)(x − 3)."
  },
  {
    id: 8,
    area: "matematicas",
    subtema: "Ecuaciones y factorización",
    pregunta: "Resuelva el sistema: x + y = 10 y x − y = 4. ¿Cuál es el valor de x?",
    opciones: ["x = 3", "x = 5", "x = 7", "x = 8"],
    respuesta: 2,
    explicacion: "Sumando ambas ecuaciones: 2x = 14, entonces x = 7. (Y se verifica: y = 10 − 7 = 3; 7 − 3 = 4)."
  },
  {
    id: 9,
    area: "matematicas",
    subtema: "Ecuaciones y factorización",
    pregunta: "¿Cuáles son las soluciones de x² − 5x + 6 = 0?",
    opciones: ["x = 1 y x = 6", "x = 2 y x = 3", "x = −2 y x = −3", "x = −1 y x = 6"],
    respuesta: 1,
    explicacion: "Factorizando: (x − 2)(x − 3) = 0, entonces x = 2 o x = 3. Verificación: 4 − 10 + 6 = 0 y 9 − 15 + 6 = 0."
  },
  {
    id: 10,
    area: "matematicas",
    subtema: "Ecuaciones y factorización",
    pregunta: "¿Cuál es la factorización de 6x² + 11x + 3?",
    opciones: ["(2x + 1)(3x + 3)", "(3x + 1)(2x + 3)", "(6x + 1)(x + 3)", "(6x + 3)(x + 1)"],
    respuesta: 1,
    explicacion: "Buscamos factores de 6×3=18 que sumen 11: son 9 y 2. Así: 6x² + 9x + 2x + 3 = 3x(2x + 3) + 1(2x + 3) = (3x + 1)(2x + 3). Verificación: (3x + 1)(2x + 3) = 6x² + 9x + 2x + 3 = 6x² + 11x + 3."
  },

  // =====================================================
  // SUBTEMA 3: Funciones y modelos matemáticos (4 preguntas)
  // =====================================================
  {
    id: 11,
    area: "matematicas",
    subtema: "Funciones y modelos matemáticos",
    pregunta: "Si f(x) = 2x² − 3x + 1, ¿cuál es el valor de f(3)?",
    opciones: ["10", "12", "8", "14"],
    respuesta: 0,
    explicacion: "f(3) = 2(3)² − 3(3) + 1 = 2(9) − 9 + 1 = 18 − 9 + 1 = 10."
  },
  {
    id: 12,
    area: "matematicas",
    subtema: "Funciones y modelos matemáticos",
    pregunta: "¿Cuál es el dominio de la función f(x) = √(x − 4)?",
    opciones: ["Todos los números reales", "x > 4", "x ≥ 4", "x ≤ 4"],
    respuesta: 2,
    explicacion: "Para que la raíz cuadrada esté definida en los reales, el radicando debe ser no negativo: x − 4 ≥ 0, es decir, x ≥ 4."
  },
  {
    id: 13,
    area: "matematicas",
    subtema: "Funciones y modelos matemáticos",
    pregunta: "Si f(x) = 3x + 2 y g(x) = x², ¿cuál es el valor de f(g(2))?",
    opciones: ["14", "16", "20", "64"],
    respuesta: 0,
    explicacion: "Primero calculamos g(2) = 2² = 4. Luego f(4) = 3(4) + 2 = 12 + 2 = 14."
  },
  {
    id: 14,
    area: "matematicas",
    subtema: "Funciones y modelos matemáticos",
    pregunta: "Una población de bacterias crece según P(t) = 500 · 2^t, donde t es el tiempo en horas. ¿Cuántas bacterias hay en t = 3?",
    opciones: ["1500", "3000", "4000", "8000"],
    respuesta: 2,
    explicacion: "P(3) = 500 · 2³ = 500 · 8 = 4000 bacterias."
  },

  // =====================================================
  // SUBTEMA 4: Sucesiones, regla de tres y proporcionalidad (4 preguntas)
  // =====================================================
  {
    id: 15,
    area: "matematicas",
    subtema: "Sucesiones, regla de tres y proporcionalidad",
    pregunta: "En la sucesión aritmética 3, 7, 11, 15, ..., ¿cuál es el décimo término?",
    opciones: ["35", "39", "41", "43"],
    respuesta: 1,
    explicacion: "La diferencia común es d = 4. El término n-ésimo es aₙ = a₁ + (n−1)d = 3 + (10−1)(4) = 3 + 36 = 39."
  },
  {
    id: 16,
    area: "matematicas",
    subtema: "Sucesiones, regla de tres y proporcionalidad",
    pregunta: "Si 8 obreros construyen un muro en 6 días, ¿cuántos días tardarán 12 obreros en hacer el mismo trabajo?",
    opciones: ["3 días", "4 días", "5 días", "9 días"],
    respuesta: 1,
    explicacion: "Es una proporción inversa: más obreros, menos días. 8 × 6 = 12 × x → x = 48/12 = 4 días."
  },
  {
    id: 17,
    area: "matematicas",
    subtema: "Sucesiones, regla de tres y proporcionalidad",
    pregunta: "¿Cuál es la suma de los primeros 20 términos de la sucesión aritmética cuyo primer término es 5 y diferencia común es 3?",
    opciones: ["670", "580", "620", "710"],
    respuesta: 0,
    explicacion: "El término 20 es a₂₀ = 5 + 19(3) = 62. La suma es S₂₀ = 20 × (5 + 62)/2 = 20 × 67/2 = 10 × 67 = 670."
  },
  {
    id: 18,
    area: "matematicas",
    subtema: "Sucesiones, regla de tres y proporcionalidad",
    pregunta: "Si 3 kg de manzanas cuestan $4,50, ¿cuánto cuestan 7 kg?",
    opciones: ["$9,00", "$10,50", "$11,50", "$12,00"],
    respuesta: 1,
    explicacion: "Regla de tres directa: (4,50 / 3) × 7 = 1,50 × 7 = $10,50."
  },

  // =====================================================
  // SUBTEMA 5: Geometría analítica básica (4 preguntas)
  // =====================================================
  {
    id: 19,
    area: "matematicas",
    subtema: "Geometría analítica básica",
    pregunta: "¿Cuál es la distancia entre los puntos A(1, 2) y B(4, 6)?",
    opciones: ["4", "5", "6", "7"],
    respuesta: 1,
    explicacion: "d = √[(4−1)² + (6−2)²] = √[9 + 16] = √25 = 5."
  },
  {
    id: 20,
    area: "matematicas",
    subtema: "Geometría analítica básica",
    pregunta: "¿Cuál es el punto medio del segmento con extremos (2, 8) y (6, 4)?",
    opciones: ["(3, 5)", "(4, 6)", "(4, 5)", "(8, 12)"],
    respuesta: 1,
    explicacion: "Punto medio = ((2+6)/2, (8+4)/2) = (8/2, 12/2) = (4, 6)."
  },
  {
    id: 21,
    area: "matematicas",
    subtema: "Geometría analítica básica",
    pregunta: "¿Cuál es la pendiente de la recta que pasa por los puntos (1, 3) y (4, 9)?",
    opciones: ["1", "2", "3", "1/2"],
    respuesta: 1,
    explicacion: "m = (y₂ − y₁)/(x₂ − x₁) = (9 − 3)/(4 − 1) = 6/3 = 2."
  },
  {
    id: 22,
    area: "matematicas",
    subtema: "Geometría analítica básica",
    pregunta: "¿Cuál es la ecuación de la recta con pendiente 3 que pasa por el punto (2, 5)?",
    opciones: ["y = 3x + 5", "y = 3x − 1", "y = 3x + 1", "y = 3x − 5"],
    respuesta: 1,
    explicacion: "Usando y − y₁ = m(x − x₁): y − 5 = 3(x − 2) → y − 5 = 3x − 6 → y = 3x − 1. Verificación: en x=2, y = 6 − 1 = 5."
  },

  // =====================================================
  // SUBTEMA 6: Matemáticas financieras (4 preguntas)
  // =====================================================
  {
    id: 23,
    area: "matematicas",
    subtema: "Matemáticas financieras",
    pregunta: "Un capital de $2.000 se invierte al 8% de interés simple anual durante 3 años. ¿Cuánto interés se genera?",
    opciones: ["$160", "$320", "$480", "$640"],
    respuesta: 2,
    explicacion: "I = C × r × t = 2000 × 0,08 × 3 = $480."
  },
  {
    id: 24,
    area: "matematicas",
    subtema: "Matemáticas financieras",
    pregunta: "¿Cuál es el monto final si se invierten $5.000 al 10% de interés compuesto anual durante 2 años?",
    opciones: ["$5.500", "$6.000", "$6.050", "$6.500"],
    respuesta: 2,
    explicacion: "M = C(1 + r)^t = 5000(1 + 0,10)² = 5000(1,21) = $6.050."
  },
  {
    id: 25,
    area: "matematicas",
    subtema: "Matemáticas financieras",
    pregunta: "Un producto cuesta $80 y se le aplica un incremento del 25%. ¿Cuál es el precio de venta?",
    opciones: ["$90", "$95", "$100", "$105"],
    respuesta: 2,
    explicacion: "Precio de venta = 80 × (1 + 0,25) = 80 × 1,25 = $100."
  },
  {
    id: 26,
    area: "matematicas",
    subtema: "Matemáticas financieras",
    pregunta: "Un artículo tiene un precio original de $120 y se aplica un descuento del 15%. ¿Cuál es el precio final?",
    opciones: ["$100", "$102", "$105", "$108"],
    respuesta: 1,
    explicacion: "Descuento = 120 × 0,15 = $18. Precio final = 120 − 18 = $102."
  },

  // =====================================================
  // SUBTEMA 7: Estadística, probabilidad y análisis de datos (5 preguntas)
  // =====================================================
  {
    id: 27,
    area: "matematicas",
    subtema: "Estadística, probabilidad y análisis de datos",
    pregunta: "¿Cuál es la media aritmética del conjunto de datos: 4, 7, 10, 3, 6?",
    opciones: ["5", "6", "7", "8"],
    respuesta: 1,
    explicacion: "Media = (4 + 7 + 10 + 3 + 6) / 5 = 30 / 5 = 6."
  },
  {
    id: 28,
    area: "matematicas",
    subtema: "Estadística, probabilidad y análisis de datos",
    pregunta: "¿Cuál es la mediana del conjunto: 12, 5, 8, 15, 3, 9, 7?",
    opciones: ["7", "8", "9", "5"],
    respuesta: 1,
    explicacion: "Ordenando: 3, 5, 7, 8, 9, 12, 15. Con 7 datos, la mediana es el valor central (posición 4): 8."
  },
  {
    id: 29,
    area: "matematicas",
    subtema: "Estadística, probabilidad y análisis de datos",
    pregunta: "¿Cuál es la moda del conjunto: 2, 5, 3, 5, 7, 5, 8, 3?",
    opciones: ["2", "3", "5", "7"],
    respuesta: 2,
    explicacion: "El valor que más se repite es 5 (aparece 3 veces), mientras que 3 aparece solo 2 veces."
  },
  {
    id: 30,
    area: "matematicas",
    subtema: "Estadística, probabilidad y análisis de datos",
    pregunta: "Al lanzar un dado justo, ¿cuál es la probabilidad de obtener un número par?",
    opciones: ["1/6", "1/3", "1/2", "2/3"],
    respuesta: 2,
    explicacion: "Los números pares en un dado son 2, 4 y 6: son 3 casos favorables de 6 posibles. P = 3/6 = 1/2."
  },
  {
    id: 31,
    area: "matematicas",
    subtema: "Estadística, probabilidad y análisis de datos",
    pregunta: "Se extraen 2 bolas sin reemplazo de una caja con 4 bolas rojas y 6 azules. ¿Cuál es la probabilidad de que ambas sean rojas?",
    opciones: ["2/15", "4/25", "1/5", "16/100"],
    respuesta: 0,
    explicacion: "P(1a roja) = 4/10. P(2a roja | 1a roja) = 3/9 = 1/3. P(ambas rojas) = (4/10)(3/9) = 12/90 = 2/15."
  },

  // =====================================================
  // SUBTEMA 8: Lógica proposicional y patrones lógico-abstractos (5 preguntas)
  // =====================================================
  {
    id: 32,
    area: "matematicas",
    subtema: "Lógica proposicional y patrones lógico-abstractos",
    pregunta: "Si p es verdadero y q es falso, ¿cuál es el valor de verdad de p → q (p implica q)?",
    opciones: ["Verdadero", "Falso", "Indeterminado", "Depende del contexto"],
    respuesta: 1,
    explicacion: "En lógica proposicional, la implicación p → q es falsa únicamente cuando p es verdadero y q es falso. Ese es exactamente este caso."
  },
  {
    id: 33,
    area: "matematicas",
    subtema: "Lógica proposicional y patrones lógico-abstractos",
    pregunta: "¿Cuál es la negación de la proposición «Todos los estudiantes aprobaron»?",
    opciones: [
      "Ningún estudiante aprobó",
      "Todos los estudiantes reprobaron",
      "Al menos un estudiante no aprobó",
      "Algunos estudiantes aprobaron"
    ],
    respuesta: 2,
    explicacion: "La negación de «Para todo x, P(x)» es «Existe al menos un x tal que no P(x)», es decir, «Al menos un estudiante no aprobó»."
  },
  {
    id: 34,
    area: "matematicas",
    subtema: "Lógica proposicional y patrones lógico-abstractos",
    pregunta: "¿Qué número continúa la serie: 2, 6, 18, 54, ...?",
    opciones: ["108", "128", "162", "180"],
    respuesta: 2,
    explicacion: "Es una progresión geométrica con razón 3 (cada término se multiplica por 3). El siguiente es 54 × 3 = 162."
  },
  {
    id: 35,
    area: "matematicas",
    subtema: "Lógica proposicional y patrones lógico-abstractos",
    pregunta: "Si la proposición p ∨ q es verdadera y p es falsa, ¿cuál es el valor de q?",
    opciones: ["Falso", "Verdadero", "Indeterminado", "Falso o verdadero"],
    respuesta: 1,
    explicacion: "Para que la disyunción p ∨ q sea verdadera, al menos uno debe ser verdadero. Si p es falso, entonces q necesariamente es verdadero."
  },
  {
    id: 36,
    area: "matematicas",
    subtema: "Lógica proposicional y patrones lógico-abstractos",
    pregunta: "¿Qué número continúa la serie: 1, 4, 9, 16, 25, ...?",
    opciones: ["30", "32", "36", "49"],
    respuesta: 2,
    explicacion: "La serie corresponde a los cuadrados perfectos: 1², 2², 3², 4², 5². El siguiente es 6² = 36."
  },

  // =====================================================
  // SUBTEMA 9: Inferencias válidas, falacias y análisis de problemas (4 preguntas)
  // =====================================================
  {
    id: 37,
    area: "matematicas",
    subtema: "Inferencias válidas, falacias y análisis de problemas",
    pregunta: "«Todos los perros son animales. Firulais es un perro. Por lo tanto, Firulais es un animal.» ¿Qué tipo de razonamiento es este?",
    opciones: ["Inductivo", "Deductivo", "Analógico", "Abductivo"],
    respuesta: 1,
    explicacion: "Es un razonamiento deductivo (silogismo válido): parte de premisas generales para llegar a una conclusión particular."
  },
  {
    id: 38,
    area: "matematicas",
    subtema: "Inferencias válidas, falacias y análisis de problemas",
    pregunta: "«Mi vecino tiene un gato negro y le fue mal en el examen. Por lo tanto, los gatos negros traen mala suerte.» ¿Qué falacia se comete?",
    opciones: [
      "Argumento ad hominem",
      "Falsa causa (correlación no implica causalidad)",
      "Falacia de autoridad",
      "Generalización apresurada solamente"
    ],
    respuesta: 1,
    explicacion: "Se comete la falacia de falsa causa: se asume que un evento causó otro solo porque ocurrieron juntos, sin evidencia de causalidad."
  },
  {
    id: 39,
    area: "matematicas",
    subtema: "Inferencias válidas, falacias y análisis de problemas",
    pregunta: "«Si llueve, el piso se moja. El piso está mojado. Por lo tanto, llovió.» ¿Qué error lógico se comete?",
    opciones: [
      "Negación del antecedente",
      "Afirmación del consecuente",
      "Silogismo disyuntivo inválido",
      "No se comete ningún error"
    ],
    respuesta: 1,
    explicacion: "Se comete la falacia de afirmación del consecuente: el piso podría estar mojado por otra razón (alguien lo lavó, por ejemplo)."
  },
  {
    id: 40,
    area: "matematicas",
    subtema: "Inferencias válidas, falacias y análisis de problemas",
    pregunta: "«Todos los A son B. Todos los B son C. Por lo tanto, todos los A son C.» ¿Esta inferencia es válida o inválida?",
    opciones: [
      "Inválida, porque no se puede generalizar",
      "Válida, es un silogismo transitivo correcto",
      "Inválida, comete la falacia del término medio",
      "Válida solo si A, B y C son conjuntos finitos"
    ],
    respuesta: 1,
    explicacion: "Es un silogismo categórico válido (forma Barbara): si A ⊂ B y B ⊂ C, entonces A ⊂ C. La transitividad de la inclusión lo garantiza."
  },

  // =====================================================
  // SUBTEMA 10: Pensamiento computacional y utilitarios digitales (4 preguntas)
  // =====================================================
  {
    id: 41,
    area: "matematicas",
    subtema: "Pensamiento computacional y utilitarios digitales",
    pregunta: "En un diagrama de flujo, ¿qué figura geométrica representa una decisión (condición)?",
    opciones: ["Rectángulo", "Óvalo", "Rombo", "Paralelogramo"],
    respuesta: 2,
    explicacion: "En diagramas de flujo, el rombo (diamante) se usa para representar decisiones con condiciones de tipo sí/no o verdadero/falso."
  },
  {
    id: 42,
    area: "matematicas",
    subtema: "Pensamiento computacional y utilitarios digitales",
    pregunta: "Un algoritmo comienza con x = 1 y repite 4 veces la operación x = x × 2. ¿Cuál es el valor final de x?",
    opciones: ["8", "12", "16", "32"],
    respuesta: 2,
    explicacion: "Iteración 1: x = 1×2 = 2. Iteración 2: x = 2×2 = 4. Iteración 3: x = 4×2 = 8. Iteración 4: x = 8×2 = 16."
  },
  {
    id: 43,
    area: "matematicas",
    subtema: "Pensamiento computacional y utilitarios digitales",
    pregunta: "¿Qué número decimal representa el número binario 1101?",
    opciones: ["11", "12", "13", "15"],
    respuesta: 2,
    explicacion: "1101 en binario = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13."
  },
  {
    id: 44,
    area: "matematicas",
    subtema: "Pensamiento computacional y utilitarios digitales",
    pregunta: "En una hoja de cálculo (Excel/Calc), ¿qué función calcula el promedio de las celdas A1 a A10?",
    opciones: ["=SUMA(A1:A10)", "=PROMEDIO(A1:A10)", "=CONTAR(A1:A10)", "=MAX(A1:A10)"],
    respuesta: 1,
    explicacion: "La función PROMEDIO (o AVERAGE en inglés) calcula la media aritmética de un rango de celdas."
  },

  // =====================================================
  // SUBTEMA 11: Física básica: movimiento, leyes de Newton, energía (6 preguntas)
  // =====================================================
  {
    id: 45,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "Un automóvil parte del reposo y acelera a 5 m/s². ¿Cuál es su velocidad después de 4 segundos?",
    opciones: ["10 m/s", "15 m/s", "20 m/s", "25 m/s"],
    respuesta: 2,
    explicacion: "Usando v = v₀ + at: v = 0 + 5(4) = 20 m/s."
  },
  {
    id: 46,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "¿Qué fuerza se necesita para acelerar una masa de 10 kg a 3 m/s²?",
    opciones: ["13 N", "30 N", "3,3 N", "0,3 N"],
    respuesta: 1,
    explicacion: "Por la segunda ley de Newton: F = m × a = 10 × 3 = 30 N."
  },
  {
    id: 47,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "Un objeto cae libremente desde el reposo. ¿Qué distancia recorre en 3 segundos? (g = 10 m/s²)",
    opciones: ["30 m", "45 m", "60 m", "90 m"],
    respuesta: 1,
    explicacion: "d = ½ × g × t² = ½ × 10 × 3² = ½ × 10 × 9 = 45 m."
  },
  {
    id: 48,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "¿Cuál es la energía cinética de un objeto de 2 kg que se mueve a 6 m/s?",
    opciones: ["12 J", "24 J", "36 J", "72 J"],
    respuesta: 2,
    explicacion: "Ec = ½ × m × v² = ½ × 2 × 6² = ½ × 2 × 36 = 36 J."
  },
  {
    id: 49,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "Un automóvil viaja a 72 km/h. ¿Cuál es su velocidad en m/s?",
    opciones: ["10 m/s", "15 m/s", "20 m/s", "25 m/s"],
    respuesta: 2,
    explicacion: "Para convertir km/h a m/s se divide entre 3,6: 72 / 3,6 = 20 m/s."
  },
  {
    id: 50,
    area: "matematicas",
    subtema: "Física básica: movimiento, leyes de Newton, energía",
    pregunta: "Un objeto de 5 kg se encuentra a una altura de 10 m. ¿Cuál es su energía potencial gravitatoria? (g = 10 m/s²)",
    opciones: ["50 J", "100 J", "250 J", "500 J"],
    respuesta: 3,
    explicacion: "Ep = m × g × h = 5 × 10 × 10 = 500 J."
  }
];

const PREGUNTAS_LENGUAJE = [
  // ============================================================
  // COMPRENSION LECTORA CRITICA (8 preguntas: IDs 51-58)
  // ============================================================
  {
    id: 51,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "Según el texto, ¿cuál es la idea principal del párrafo?",
    lectura: "La deforestación en la Amazonía ecuatoriana ha alcanzado niveles alarmantes en las últimas décadas. La tala indiscriminada de árboles no solo destruye el hábitat de miles de especies, sino que también afecta directamente a las comunidades indígenas que dependen del bosque para su supervivencia. Organizaciones ambientales han señalado que, de continuar este ritmo, en cincuenta años podría desaparecer una tercera parte de la selva amazónica del país.",
    opciones: [
      "Las organizaciones ambientales han logrado detener la deforestación",
      "La deforestación en la Amazonía ecuatoriana tiene graves consecuencias ecológicas y sociales",
      "Las comunidades indígenas son las principales responsables de la tala de árboles",
      "La selva amazónica ecuatoriana desaparecerá por completo en cincuenta años"
    ],
    respuesta: 1,
    explicacion: "La idea principal integra las consecuencias ecológicas (destrucción de hábitat) y sociales (afectación a comunidades indígenas) de la deforestación en la Amazonía ecuatoriana."
  },
  {
    id: 52,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "¿Cuál es el propósito comunicativo del texto?",
    lectura: "Estimados ciudadanos: Les informamos que a partir del 1 de octubre se implementará un nuevo sistema de recolección de desechos en el cantón. Los días lunes y jueves se recogerán residuos orgánicos, mientras que los martes y viernes se retirarán los materiales reciclables. Les solicitamos colocar los residuos en los contenedores correspondientes antes de las 7:00 a.m. Su colaboración es fundamental para mantener limpia nuestra ciudad.",
    opciones: [
      "Narrar una historia sobre el medio ambiente",
      "Persuadir a los ciudadanos para que compren contenedores nuevos",
      "Informar sobre cambios en el sistema de recolección de desechos y solicitar colaboración",
      "Describir las características del nuevo sistema de reciclaje a nivel nacional"
    ],
    respuesta: 2,
    explicacion: "El texto tiene un propósito informativo (comunica el nuevo horario de recolección) y apelativo (solicita la colaboración ciudadana). No narra, no persuade para comprar, ni habla de un sistema nacional."
  },
  {
    id: 53,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "Según el texto, ¿qué caracteriza a la generación actual respecto a la lectura?",
    lectura: "Algunos críticos sostienen que las nuevas generaciones han abandonado la lectura. Sin embargo, los jóvenes de hoy leen más que nunca: blogs, redes sociales, artículos en línea y libros digitales forman parte de su dieta informativa diaria. Lo que ha cambiado no es la cantidad de lectura, sino el formato y el soporte en que se realiza. La pantalla ha reemplazado al papel, pero el acto de leer permanece vigente.",
    opciones: [
      "Han dejado de leer por completo debido a la tecnología",
      "Leen exclusivamente libros impresos de literatura clásica",
      "Siguen leyendo, pero en formatos y soportes diferentes al papel tradicional",
      "Solo leen contenido superficial en redes sociales"
    ],
    respuesta: 2,
    explicacion: "El texto argumenta que los jóvenes no han dejado de leer, sino que el formato cambió: del papel a la pantalla. La lectura sigue vigente en nuevos soportes digitales."
  },
  {
    id: 54,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "¿Qué tipo de texto es el fragmento presentado?",
    lectura: "El agua es un recurso indispensable para la vida en el planeta. Está compuesta por dos átomos de hidrógeno y uno de oxígeno, y cubre aproximadamente el 71% de la superficie terrestre. Sin embargo, solo el 2,5% del agua existente es dulce, y de esta, apenas el 0,3% se encuentra en ríos y lagos accesibles para el consumo humano directo.",
    opciones: [
      "Texto narrativo, porque cuenta una historia sobre el agua",
      "Texto expositivo, porque presenta información objetiva y datos sobre el agua",
      "Texto argumentativo, porque defiende una postura sobre el uso del agua",
      "Texto literario, porque emplea figuras retóricas para describir el agua"
    ],
    respuesta: 1,
    explicacion: "Es un texto expositivo porque presenta datos objetivos (composición química, porcentajes) sin defender una posición personal ni narrar hechos ficticios."
  },
  {
    id: 55,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "¿Cuál es la postura del autor respecto al tema tratado?",
    lectura: "El uso excesivo de plásticos de un solo uso constituye una de las mayores amenazas para los océanos. Cada año, millones de toneladas de plástico terminan en el mar, causando la muerte de tortugas, aves y peces. Es imperativo que los gobiernos implementen políticas de prohibición y que los ciudadanos adopten alternativas reutilizables. No podemos seguir siendo cómplices silenciosos de esta catástrofe ambiental.",
    opciones: [
      "Neutral: presenta los hechos sin emitir juicio",
      "Crítica y urgente: denuncia el problema y exige acciones concretas",
      "Optimista: celebra los avances logrados contra la contaminación",
      "Indiferente: considera que el problema no tiene solución"
    ],
    respuesta: 1,
    explicacion: "El autor usa expresiones como 'es imperativo', 'no podemos seguir siendo cómplices' y 'catástrofe ambiental', lo que evidencia una postura crítica y un llamado urgente a la acción."
  },
  {
    id: 56,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "De acuerdo con el texto, ¿cuál fue la consecuencia principal de la migración mencionada?",
    lectura: "A finales de los años noventa, Ecuador atravesó una de las peores crisis económicas de su historia. El feriado bancario de 1999 y la posterior dolarización provocaron que miles de familias perdieran sus ahorros. Como resultado, se produjo una ola migratoria masiva, principalmente hacia España, Italia y Estados Unidos. Este fenómeno transformó la estructura social del país: comunidades enteras quedaron fragmentadas y los niños crecieron bajo el cuidado de abuelos o tíos.",
    opciones: [
      "La economía ecuatoriana se recuperó inmediatamente gracias a las remesas",
      "La fragmentación de las familias y comunidades ecuatorianas",
      "El fortalecimiento del sistema bancario nacional",
      "La eliminación total de la pobreza en el Ecuador"
    ],
    respuesta: 1,
    explicacion: "El texto señala explícitamente que la migración 'transformó la estructura social': comunidades fragmentadas y niños criados por familiares distintos a sus padres."
  },
  {
    id: 57,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "¿Qué función cumple la última oración del texto?",
    lectura: "La inteligencia artificial ha revolucionado múltiples campos: la medicina, la educación, el transporte y la industria. Sus beneficios son innegables: diagnósticos más precisos, aprendizaje personalizado y procesos automatizados. No obstante, también plantea dilemas éticos sobre la privacidad de los datos y la posible sustitución de empleos humanos. En definitiva, la inteligencia artificial es una herramienta poderosa cuyo impacto dependerá del uso responsable que le demos.",
    opciones: [
      "Introduce un tema nuevo que no se relaciona con el resto del texto",
      "Presenta un ejemplo específico del uso de la inteligencia artificial",
      "Sintetiza la idea central del texto y ofrece una conclusión reflexiva",
      "Contradice todo lo expuesto anteriormente en el párrafo"
    ],
    respuesta: 2,
    explicacion: "La expresión 'En definitiva' indica que la última oración es una conclusión que sintetiza lo expuesto: la IA es poderosa, pero su impacto depende del uso responsable."
  },
  {
    id: 58,
    area: "lenguaje",
    subtema: "Comprensión lectora crítica",
    pregunta: "¿Qué recurso utiliza el autor para dar credibilidad a su argumento?",
    lectura: "Según un estudio publicado por la Organización Mundial de la Salud en 2023, el 90% de la población mundial respira aire contaminado. El doctor Hernández, especialista en neumología, advierte que la exposición prolongada a partículas finas causa enfermedades respiratorias crónicas. Ante estas evidencias, resulta urgente que las ciudades inviertan en transporte público eléctrico y zonas verdes.",
    opciones: [
      "Anécdotas personales del autor",
      "Datos estadísticos y citas de autoridad (organismo internacional y especialista)",
      "Comparaciones con otros países desarrollados",
      "Descripciones literarias de paisajes contaminados"
    ],
    respuesta: 1,
    explicacion: "El autor cita a la OMS (organismo internacional) y al doctor Hernández (especialista), y presenta un dato estadístico (90%). Estos son recursos de autoridad y evidencia empírica que dan credibilidad al argumento."
  },

  // ============================================================
  // INFERENCIAS EN TEXTOS (6 preguntas: IDs 59-64)
  // ============================================================
  {
    id: 59,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "¿Qué se puede inferir sobre la situación económica de la familia descrita?",
    lectura: "María caminó descalza hasta la escuela porque sus únicos zapatos se habían roto la semana anterior. En su mochila llevaba un cuaderno con pocas hojas en blanco y un lápiz gastado hasta la mitad. Al llegar al aula, se sentó al fondo, tratando de pasar desapercibida mientras los demás niños mostraban sus útiles nuevos.",
    opciones: [
      "La familia de María es adinerada pero descuidada",
      "María prefiere no usar zapatos por comodidad",
      "La familia de María atraviesa dificultades económicas que limitan sus recursos básicos",
      "María es una niña rebelde que rechaza las normas escolares"
    ],
    respuesta: 2,
    explicacion: "Los indicios (caminar descalza por zapatos rotos, cuaderno con pocas hojas, lápiz gastado, actitud de ocultarse) permiten inferir que la familia enfrenta carencias económicas."
  },
  {
    id: 60,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "¿Qué se puede inferir sobre el estado emocional del personaje?",
    lectura: "Andrés miraba el teléfono cada dos minutos. Se levantaba del sofá, caminaba hasta la ventana, regresaba y volvía a sentarse. Sus manos no dejaban de moverse. Cuando finalmente sonó el teléfono, lo tomó antes de que completara el primer timbre.",
    opciones: [
      "Andrés estaba aburrido y buscaba entretenimiento",
      "Andrés se sentía tranquilo y relajado en su hogar",
      "Andrés esperaba una llamada con gran ansiedad e impaciencia",
      "Andrés estaba enojado con la persona que debía llamar"
    ],
    respuesta: 2,
    explicacion: "Los movimientos repetitivos (mirar el teléfono, levantarse, sentarse, manos inquietas) y la rapidez al contestar revelan un estado de ansiedad e impaciencia por recibir la llamada."
  },
  {
    id: 61,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "Del texto se puede inferir que el autor considera que la educación:",
    lectura: "En muchos países, los presupuestos destinados a educación se reducen año tras año, mientras que el gasto militar aumenta. Las aulas se deterioran, los maestros reciben salarios insuficientes y los estudiantes carecen de materiales básicos. Paradójicamente, los mismos gobiernos que recortan estos fondos proclaman que la educación es la base del desarrollo nacional.",
    opciones: [
      "Recibe la atención presupuestaria que merece por parte de los gobiernos",
      "Es menos importante que la defensa nacional para el progreso de un país",
      "Es declarada prioritaria en el discurso político, pero no se refleja en la asignación de recursos",
      "Ha mejorado notablemente gracias a las políticas gubernamentales recientes"
    ],
    respuesta: 2,
    explicacion: "La palabra 'paradójicamente' señala la contradicción entre el discurso (la educación es la base del desarrollo) y la práctica (recortes presupuestarios). El autor critica que la prioridad es solo discursiva."
  },
  {
    id: 62,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "¿Qué se puede inferir sobre la relación entre los dos personajes?",
    lectura: "Elena dejó las llaves sobre la mesa sin decir una palabra. Roberto la miró desde el otro extremo de la habitación, pero ninguno rompió el silencio. Ella tomó su maleta, que ya estaba preparada junto a la puerta, y salió sin voltear. Roberto se quedó inmóvil, escuchando cómo el motor del auto se alejaba lentamente.",
    opciones: [
      "Elena y Roberto se están preparando para unas vacaciones juntos",
      "Elena se va definitivamente y su relación con Roberto ha terminado o está en crisis profunda",
      "Roberto y Elena están jugando a las escondidas",
      "Elena sale a trabajar como lo hace todas las mañanas"
    ],
    respuesta: 1,
    explicacion: "Los indicios (dejar las llaves, silencio tenso, maleta preparada, salir sin voltear, inmovilidad de Roberto) sugieren una ruptura o separación definitiva entre ambos personajes."
  },
  {
    id: 63,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "¿Qué se puede inferir sobre la época en que se desarrolla la escena?",
    lectura: "Don Jacinto encendió el candil y lo colocó sobre la mesa de madera. Afuera, el sonido de los cascos de los caballos sobre el empedrado se mezclaba con el pregón lejano del sereno que anunciaba la medianoche. Tomó la pluma, la mojó en el tintero y comenzó a escribir una carta que tardaría semanas en llegar a su destino.",
    opciones: [
      "La escena ocurre en la época contemporánea, en una zona rural",
      "La escena se desarrolla en una época anterior a la electricidad y las comunicaciones modernas",
      "La escena ocurre durante una emergencia por corte de luz",
      "La escena tiene lugar en un museo histórico"
    ],
    respuesta: 1,
    explicacion: "El uso de candil, caballos, sereno nocturno, pluma con tintero y una carta que tarda semanas indican una época anterior a la electricidad, el transporte motorizado y las telecomunicaciones."
  },
  {
    id: 64,
    area: "lenguaje",
    subtema: "Inferencias en textos",
    pregunta: "¿Qué se puede inferir sobre la intención del hablante en el fragmento?",
    lectura: "\"¡Qué maravilloso servicio el de esta empresa! Solo tuve que esperar tres horas para que me atendieran, me transfirieron a cinco departamentos diferentes y, al final, nadie pudo resolver mi problema. Sin duda, una experiencia inolvidable\", escribió el cliente en la sección de comentarios.",
    opciones: [
      "El cliente está elogiando sinceramente el servicio recibido",
      "El cliente usa la ironía para criticar el pésimo servicio que recibió",
      "El cliente está agradecido por la paciencia de los empleados",
      "El cliente recomienda la empresa a otros usuarios"
    ],
    respuesta: 1,
    explicacion: "El cliente usa ironía: las palabras 'maravilloso', 'sin duda' e 'inolvidable' contrastan con la experiencia negativa descrita (tres horas de espera, cinco transferencias, problema sin resolver)."
  },

  // ============================================================
  // CONECTORES Y COHERENCIA TEXTUAL (6 preguntas: IDs 65-70)
  // ============================================================
  {
    id: 65,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "Seleccione el conector adecuado para completar el enunciado: \"Estudió durante toda la noche; ________, no logró aprobar el examen.\"",
    lectura: null,
    opciones: [
      "por lo tanto",
      "sin embargo",
      "además",
      "es decir"
    ],
    respuesta: 1,
    explicacion: "'Sin embargo' es un conector adversativo que introduce una idea contraria a lo esperado. Si estudió toda la noche, se esperaría que aprobara, pero no fue así."
  },
  {
    id: 66,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "¿Qué conector completa correctamente la oración? \"El Ecuador posee una gran biodiversidad ________ se encuentra en la zona ecuatorial y cuenta con diversas regiones climáticas.\"",
    lectura: null,
    opciones: [
      "aunque",
      "porque",
      "pero",
      "a pesar de que"
    ],
    respuesta: 1,
    explicacion: "'Porque' es un conector causal. La oración explica la razón de la biodiversidad: la ubicación ecuatorial y la diversidad climática son la causa."
  },
  {
    id: 67,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "Identifique el conector que da coherencia al texto: \"Primero, se debe investigar el tema. ________, se organiza la información en un esquema. Finalmente, se redacta el ensayo.\"",
    lectura: null,
    opciones: [
      "Sin embargo",
      "Luego",
      "Aunque",
      "Por el contrario"
    ],
    respuesta: 1,
    explicacion: "'Luego' es un conector temporal de secuencia que indica el paso intermedio entre 'primero' y 'finalmente', manteniendo el orden lógico del proceso."
  },
  {
    id: 68,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "Seleccione la opción que presenta los conectores adecuados: \"La contaminación del aire afecta la salud, ________ causa enfermedades respiratorias; ________, incrementa los costos del sistema de salud pública.\"",
    lectura: null,
    opciones: [
      "ya que / además",
      "pero / sin embargo",
      "aunque / por el contrario",
      "ni / tampoco"
    ],
    respuesta: 0,
    explicacion: "'Ya que' introduce la causa (enfermedades respiratorias) y 'además' añade una consecuencia adicional (costos del sistema de salud). Ambos conectores mantienen la coherencia del argumento."
  },
  {
    id: 69,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "¿Cuál es el orden correcto de las oraciones para formar un párrafo coherente?\n1. Por eso, es fundamental fomentar el hábito desde la infancia.\n2. La lectura desarrolla el pensamiento crítico y amplía el vocabulario.\n3. Sin embargo, muchos jóvenes prefieren las redes sociales al libro.\n4. En conclusión, leer es una herramienta indispensable para el desarrollo intelectual.",
    lectura: null,
    opciones: [
      "2 - 3 - 1 - 4",
      "1 - 2 - 3 - 4",
      "3 - 2 - 4 - 1",
      "4 - 1 - 2 - 3"
    ],
    respuesta: 0,
    explicacion: "El orden lógico es: presentación del beneficio (2), contraste con la realidad (3), consecuencia/recomendación (1) y cierre conclusivo (4). Los conectores 'sin embargo', 'por eso' y 'en conclusión' confirman esta secuencia."
  },
  {
    id: 70,
    area: "lenguaje",
    subtema: "Conectores y coherencia textual",
    pregunta: "Complete el enunciado con el conector correcto: \"No asistió a clases ________ estaba enfermo; ________, envió sus tareas por correo electrónico.\"",
    lectura: null,
    opciones: [
      "porque / no obstante",
      "aunque / por lo tanto",
      "si bien / además",
      "mientras / tampoco"
    ],
    respuesta: 0,
    explicacion: "'Porque' introduce la causa de su inasistencia (enfermedad) y 'no obstante' introduce una acción contraria a lo esperado (a pesar de no asistir, envió las tareas)."
  },

  // ============================================================
  // ANALOGIAS Y RELACIONES SEMANTICAS (6 preguntas: IDs 71-76)
  // ============================================================
  {
    id: 71,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "Complete la analogía: MÉDICO es a HOSPITAL como PROFESOR es a ________.",
    lectura: null,
    opciones: [
      "Estudiante",
      "Escuela",
      "Libro",
      "Conocimiento"
    ],
    respuesta: 1,
    explicacion: "La relación es profesional-lugar de trabajo. El médico trabaja en el hospital; el profesor trabaja en la escuela."
  },
  {
    id: 72,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "Identifique la relación analógica: HAMBRE es a COMER como SED es a ________.",
    lectura: null,
    opciones: [
      "Agua",
      "Beber",
      "Sed",
      "Alimento"
    ],
    respuesta: 1,
    explicacion: "La relación es necesidad-acción que la satisface. El hambre se satisface al comer; la sed se satisface al beber."
  },
  {
    id: 73,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "¿Cuál es el antónimo de la palabra EFÍMERO?",
    lectura: null,
    opciones: [
      "Breve",
      "Fugaz",
      "Perenne",
      "Transitorio"
    ],
    respuesta: 2,
    explicacion: "'Efímero' significa de corta duración. Su antónimo es 'perenne', que significa duradero o permanente. Las demás opciones (breve, fugaz, transitorio) son sinónimos de efímero."
  },
  {
    id: 74,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "Complete la analogía: OJO es a VER como OÍDO es a ________.",
    lectura: null,
    opciones: [
      "Sonido",
      "Hablar",
      "Oír",
      "Oreja"
    ],
    respuesta: 2,
    explicacion: "La relación es órgano sensorial-función. El ojo tiene la función de ver; el oído tiene la función de oír."
  },
  {
    id: 75,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "Identifique el par de palabras que tiene la misma relación que: GENEROSO : TACAÑO",
    lectura: null,
    opciones: [
      "Valiente : Cobarde",
      "Amable : Cortés",
      "Alegre : Contento",
      "Rápido : Veloz"
    ],
    respuesta: 0,
    explicacion: "La relación entre generoso y tacaño es de antonimia (significados opuestos). El único par con relación de antonimia es valiente-cobarde. Los demás son sinónimos."
  },
  {
    id: 76,
    area: "lenguaje",
    subtema: "Analogías y relaciones semánticas",
    pregunta: "¿Cuál es el sinónimo más adecuado de la palabra LACÓNICO?",
    lectura: null,
    opciones: [
      "Extenso",
      "Breve y conciso",
      "Confuso",
      "Elocuente"
    ],
    respuesta: 1,
    explicacion: "'Lacónico' significa que se expresa con pocas palabras, de manera breve y concisa. 'Extenso' y 'elocuente' son más bien opuestos, y 'confuso' no guarda relación."
  },

  // ============================================================
  // GENEROS LITERARIOS, FIGURAS RETORICAS (6 preguntas: IDs 77-82)
  // ============================================================
  {
    id: 77,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "¿Qué figura retórica se emplea en la expresión \"Sus cabellos eran de oro\"?",
    lectura: null,
    opciones: [
      "Símil",
      "Hipérbole",
      "Metáfora",
      "Personificación"
    ],
    respuesta: 2,
    explicacion: "Es una metáfora porque establece una identificación directa entre los cabellos y el oro (rubios y brillantes), sin usar un nexo comparativo como 'como' o 'parece'."
  },
  {
    id: 78,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "Identifique la figura retórica en: \"El viento susurraba secretos entre los árboles.\"",
    lectura: null,
    opciones: [
      "Metáfora",
      "Hipérbole",
      "Personificación",
      "Anáfora"
    ],
    respuesta: 2,
    explicacion: "Es personificación (o prosopopeya) porque se atribuye al viento una acción humana: susurrar secretos. Los elementos no humanos reciben cualidades humanas."
  },
  {
    id: 79,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "¿Qué figura retórica se utiliza en: \"Te lo he dicho un millón de veces\"?",
    lectura: null,
    opciones: [
      "Ironía",
      "Símil",
      "Hipérbole",
      "Anáfora"
    ],
    respuesta: 2,
    explicacion: "Es hipérbole porque exagera la cantidad de veces que se ha dicho algo ('un millón de veces') para enfatizar la insistencia. No se trata literalmente de un millón."
  },
  {
    id: 80,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "¿A qué género literario pertenece una obra escrita en verso que expresa los sentimientos íntimos del autor?",
    lectura: null,
    opciones: [
      "Género narrativo",
      "Género dramático",
      "Género lírico",
      "Género didáctico"
    ],
    respuesta: 2,
    explicacion: "El género lírico se caracteriza por la expresión de sentimientos, emociones y estados de ánimo del autor, generalmente en verso. El narrativo cuenta historias, el dramático es para representación teatral."
  },
  {
    id: 81,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "Identifique la figura retórica en los siguientes versos: \"Temprano levantó la muerte el vuelo, / temprano madrugó la madrugada, / temprano estás rodando por el suelo.\"",
    lectura: null,
    opciones: [
      "Metáfora",
      "Hipérbole",
      "Símil",
      "Anáfora"
    ],
    respuesta: 3,
    explicacion: "Es anáfora porque la palabra 'temprano' se repite al inicio de cada verso. La anáfora es la repetición de una o varias palabras al comienzo de versos u oraciones sucesivas."
  },
  {
    id: 82,
    area: "lenguaje",
    subtema: "Géneros literarios, figuras retóricas",
    pregunta: "¿Qué figura retórica se emplea en: \"Era tan delgado como un hilo\"?",
    lectura: null,
    opciones: [
      "Metáfora",
      "Símil o comparación",
      "Personificación",
      "Ironía"
    ],
    respuesta: 1,
    explicacion: "Es un símil o comparación porque establece una semejanza entre la delgadez de la persona y un hilo utilizando el nexo comparativo 'como'. La metáfora no usa nexo comparativo."
  },

  // ============================================================
  // VICIOS DEL LENGUAJE Y REDACCION CORRECTA (6 preguntas: IDs 83-88)
  // ============================================================
  {
    id: 83,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "¿Cuál de las siguientes oraciones contiene un caso de dequeísmo?",
    lectura: null,
    opciones: [
      "Me alegro de que hayas venido.",
      "Pienso de que deberías estudiar más.",
      "Estoy seguro de que lo logrará.",
      "Se acordó de que tenía una cita."
    ],
    respuesta: 1,
    explicacion: "El dequeísmo consiste en añadir incorrectamente la preposición 'de' antes de 'que'. Lo correcto es 'pienso que', no 'pienso de que'. Las demás oraciones usan 'de que' correctamente porque sus verbos lo requieren."
  },
  {
    id: 84,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "Identifique la oración que presenta redundancia (pleonasmo vicioso):",
    lectura: null,
    opciones: [
      "Salió fuera de la casa rápidamente.",
      "Caminó por la calle principal del pueblo.",
      "Leyó un libro interesante durante la tarde.",
      "Escribió una carta para su madre."
    ],
    respuesta: 0,
    explicacion: "'Salió fuera' es redundante porque 'salir' ya implica ir hacia fuera. Lo correcto sería 'salió de la casa' o simplemente 'salió'. Las demás oraciones no tienen redundancias."
  },
  {
    id: 85,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "¿Cuál de las siguientes oraciones contiene un caso de queísmo?",
    lectura: null,
    opciones: [
      "Creo que vendrá mañana.",
      "Me alegro que te haya ido bien.",
      "Dijo que no podía asistir.",
      "Parece que va a llover."
    ],
    respuesta: 1,
    explicacion: "El queísmo consiste en omitir la preposición 'de' antes de 'que' cuando es necesaria. Lo correcto es 'me alegro de que te haya ido bien'. El verbo 'alegrarse' rige la preposición 'de'."
  },
  {
    id: 86,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "Identifique la oración que contiene un solecismo (error de sintaxis):",
    lectura: null,
    opciones: [
      "Hubieron muchos problemas durante el evento.",
      "Hubo muchos problemas durante el evento.",
      "Ha habido varios incidentes este mes.",
      "Hay demasiados obstáculos en el camino."
    ],
    respuesta: 0,
    explicacion: "'Hubieron' es un solecismo. El verbo 'haber' en sentido impersonal no se conjuga en plural. Lo correcto es 'hubo muchos problemas', ya que 'problemas' no es sujeto sino complemento directo."
  },
  {
    id: 87,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "¿Cuál de las siguientes expresiones contiene un barbarismo?",
    lectura: null,
    opciones: [
      "La prevención es fundamental.",
      "Necesito que me expliques el tópico.",
      "Haiga terminado la tarea antes del plazo.",
      "Debemos analizar las consecuencias."
    ],
    respuesta: 2,
    explicacion: "'Haiga' es un barbarismo, es decir, una deformación de la palabra correcta 'haya' (del verbo haber). Es un error frecuente en el habla coloquial que debe evitarse en la escritura formal."
  },
  {
    id: 88,
    area: "lenguaje",
    subtema: "Vicios del lenguaje y redacción correcta",
    pregunta: "Seleccione la oración correctamente redactada:",
    lectura: null,
    opciones: [
      "Voy a entrar adentro del edificio para buscar información.",
      "Le informo de que su solicitud ha sido aprobada.",
      "En base a los resultados, tomaremos una decisión.",
      "Con base en los resultados, tomaremos una decisión."
    ],
    respuesta: 3,
    explicacion: "'Con base en' es la expresión correcta, no 'en base a' (calco del inglés 'based on'). 'Entrar adentro' es redundancia. 'Le informo de que' es correcto gramaticalmente, pero 'con base en' es la única opción sin ningún error."
  },

  // ============================================================
  // LITERATURA ECUATORIANA Y LATINOAMERICANA (6 preguntas: IDs 89-94)
  // ============================================================
  {
    id: 89,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "¿Quién es el autor de la novela 'Huasipungo', obra emblemática del indigenismo ecuatoriano?",
    lectura: null,
    opciones: [
      "José de la Cuadra",
      "Demetrio Aguilera Malta",
      "Jorge Icaza",
      "Adalberto Ortiz"
    ],
    respuesta: 2,
    explicacion: "'Huasipungo' (1934) fue escrita por Jorge Icaza. Es la novela indigenista ecuatoriana más reconocida internacionalmente y denuncia la explotación de los indígenas en el sistema de haciendas."
  },
  {
    id: 90,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "Gabriel García Márquez, autor de 'Cien años de soledad', es el principal representante del movimiento literario conocido como:",
    lectura: null,
    opciones: [
      "Naturalismo",
      "Realismo mágico",
      "Vanguardismo",
      "Romanticismo"
    ],
    respuesta: 1,
    explicacion: "García Márquez es el máximo exponente del realismo mágico, corriente en la que los elementos fantásticos y sobrenaturales se presentan como parte natural de la realidad cotidiana. 'Cien años de soledad' (1967) es su obra cumbre."
  },
  {
    id: 91,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "Medardo Ángel Silva, poeta ecuatoriano perteneciente a la 'Generación Decapitada', es autor del célebre poema:",
    lectura: null,
    opciones: [
      "Boletín y elegía de las mitas",
      "El alma en los labios",
      "Veinte poemas de amor y una canción desesperada",
      "Altazor"
    ],
    respuesta: 1,
    explicacion: "'El alma en los labios' es el poema más conocido de Medardo Ángel Silva (1898-1919), poeta modernista guayaquileño de la Generación Decapitada. 'Boletín y elegía de las mitas' es de César Dávila Andrade."
  },
  {
    id: 92,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "La novela 'Pedro Páramo', considerada una obra maestra de la literatura hispanoamericana, fue escrita por:",
    lectura: null,
    opciones: [
      "Julio Cortázar",
      "Octavio Paz",
      "Juan Rulfo",
      "Jorge Luis Borges"
    ],
    respuesta: 2,
    explicacion: "'Pedro Páramo' (1955) fue escrita por el mexicano Juan Rulfo. Esta novela, junto con 'El llano en llamas', constituye toda su obra narrativa publicada y es considerada precursora del realismo mágico."
  },
  {
    id: 93,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "La novela 'Juyungo', que aborda la vida y las luchas del pueblo afroecuatoriano en Esmeraldas, fue escrita por:",
    lectura: null,
    opciones: [
      "Pablo Palacio",
      "Adalberto Ortiz",
      "Jorge Enrique Adoum",
      "Demetrio Aguilera Malta"
    ],
    respuesta: 1,
    explicacion: "'Juyungo' (1943) fue escrita por Adalberto Ortiz, escritor esmeraldeño. Es la obra más representativa de la literatura afroecuatoriana y retrata la discriminación racial y la lucha por la identidad."
  },
  {
    id: 94,
    area: "lenguaje",
    subtema: "Literatura ecuatoriana y latinoamericana",
    pregunta: "Gabriela Mistral, primera persona latinoamericana en recibir el Premio Nobel de Literatura (1945), era de nacionalidad:",
    lectura: null,
    opciones: [
      "Argentina",
      "Colombiana",
      "Mexicana",
      "Chilena"
    ],
    respuesta: 3,
    explicacion: "Gabriela Mistral (1889-1957), cuyo nombre real era Lucila Godoy Alcayaga, fue una poeta y diplomática chilena. Recibió el Nobel de Literatura en 1945, siendo la primera persona latinoamericana en obtenerlo."
  },

  // ============================================================
  // PRODUCCION DE TEXTOS ARGUMENTATIVOS (6 preguntas: IDs 95-100)
  // ============================================================
  {
    id: 95,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "¿Cuál es la estructura básica de un texto argumentativo?",
    lectura: null,
    opciones: [
      "Inicio, nudo y desenlace",
      "Tesis, argumentos y conclusión",
      "Introducción, métodos y resultados",
      "Planteamiento, hipótesis y experimentación"
    ],
    respuesta: 1,
    explicacion: "Un texto argumentativo se estructura en: tesis (postura del autor), argumentos (razones que sustentan la tesis) y conclusión (cierre que reafirma la postura). Inicio-nudo-desenlace corresponde a la narrativa."
  },
  {
    id: 96,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "¿Cuál de las siguientes opciones es un argumento de autoridad?",
    lectura: null,
    opciones: [
      "Todos sabemos que el ejercicio es bueno para la salud.",
      "Según la Organización Mundial de la Salud, 30 minutos diarios de ejercicio reducen el riesgo cardiovascular en un 35%.",
      "Yo creo que hacer ejercicio es importante porque me siento mejor.",
      "Mi vecino dice que caminar es la mejor actividad física."
    ],
    respuesta: 1,
    explicacion: "Un argumento de autoridad se respalda en fuentes reconocidas y confiables. Citar a la OMS con un dato específico constituye un argumento de autoridad. Las demás opciones son opiniones personales o apelaciones al sentido común."
  },
  {
    id: 97,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "En un ensayo argumentativo, ¿qué función cumple la contraargumentación?",
    lectura: null,
    opciones: [
      "Repetir la tesis para que el lector la recuerde",
      "Presentar una postura opuesta para luego refutarla y fortalecer la propia tesis",
      "Narrar una anécdota que entretenga al lector",
      "Describir detalladamente el contexto histórico del tema"
    ],
    respuesta: 1,
    explicacion: "La contraargumentación consiste en anticipar y presentar los argumentos contrarios para después rebatirlos. Esto fortalece la tesis del autor al demostrar que ha considerado otras perspectivas y puede refutarlas."
  },
  {
    id: 98,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "¿Cuál de las siguientes oraciones constituye una tesis adecuada para un ensayo argumentativo?",
    lectura: null,
    opciones: [
      "El cambio climático es un tema interesante.",
      "La educación bilingüe debería implementarse obligatoriamente en todas las escuelas del Ecuador para mejorar la competitividad profesional.",
      "Muchas personas opinan cosas diferentes sobre la tecnología.",
      "La historia del Ecuador es muy larga y tiene muchos eventos."
    ],
    respuesta: 1,
    explicacion: "Una tesis debe expresar una postura clara y debatible sobre un tema específico. La opción correcta presenta una afirmación concreta ('debería implementarse obligatoriamente') que puede ser argumentada y refutada. Las demás son vagas o meramente descriptivas."
  },
  {
    id: 99,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "¿Qué tipo de falacia se comete en el siguiente argumento? \"No debemos escuchar la propuesta del concejal sobre educación porque él no terminó la universidad.\"",
    lectura: null,
    opciones: [
      "Falacia ad populum (apelación al pueblo)",
      "Falacia ad hominem (ataque a la persona)",
      "Falacia de falsa causa",
      "Falacia de generalización apresurada"
    ],
    respuesta: 1,
    explicacion: "Es una falacia ad hominem porque ataca a la persona (el concejal no terminó la universidad) en lugar de refutar su propuesta con argumentos. Se descalifica al emisor para invalidar su mensaje, lo cual es un razonamiento falaz."
  },
  {
    id: 100,
    area: "lenguaje",
    subtema: "Producción de textos argumentativos",
    pregunta: "Al redactar la conclusión de un texto argumentativo, se debe:",
    lectura: null,
    opciones: [
      "Introducir argumentos completamente nuevos que no se discutieron antes",
      "Copiar textualmente la introducción del ensayo",
      "Retomar la tesis, sintetizar los argumentos principales y cerrar con una reflexión final",
      "Incluir únicamente una cita de un autor famoso sin comentario"
    ],
    respuesta: 2,
    explicacion: "La conclusión de un texto argumentativo debe retomar la tesis (reafirmarla), sintetizar los argumentos centrales y ofrecer una reflexión o recomendación final. No introduce ideas nuevas ni repite textualmente la introducción."
  }
];

const PREGUNTAS_SOCIALES = [
  // =====================================================
  // HISTORIA DEL ECUADOR: REVOLUCIÓN LIBERAL Y DEMOCRACIA
  // (9 preguntas: IDs 101–109)
  // =====================================================
  {
    id: 101,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿En qué año se produjo la Revolución Liberal liderada por Eloy Alfaro en Ecuador?",
    opciones: ["1885", "1895", "1905", "1875"],
    respuesta: 1,
    explicacion: "La Revolución Liberal se inició el 5 de junio de 1895 con Eloy Alfaro al mando, estableciendo reformas como la separación Iglesia-Estado y la educación laica obligatoria y gratuita."
  },
  {
    id: 102,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Qué batalla, librada el 24 de mayo de 1822, selló la independencia del territorio que hoy es Ecuador?",
    opciones: ["Batalla de Junín", "Batalla de Tarqui", "Batalla del Pichincha", "Batalla de Ayacucho"],
    respuesta: 2,
    explicacion: "La Batalla del Pichincha, comandada por el mariscal Antonio José de Sucre, tuvo lugar el 24 de mayo de 1822 en las faldas del volcán Pichincha y aseguró la liberación del territorio ecuatoriano del dominio español."
  },
  {
    id: 103,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Quién fue el primer presidente del Ecuador tras su separación de la Gran Colombia en 1830?",
    opciones: ["Juan José Flores", "Vicente Rocafuerte", "Antonio José de Sucre", "Gabriel García Moreno"],
    respuesta: 0,
    explicacion: "Juan José Flores, militar de origen venezolano, fue el primer presidente del Ecuador en 1830 tras la disolución de la Gran Colombia. Gobernó en los periodos 1830-1834, 1839-1843 y 1843-1845."
  },
  {
    id: 104,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Qué presidente ecuatoriano del siglo XIX es conocido por su gobierno conservador y por impulsar la educación religiosa, siendo asesinado en 1875?",
    opciones: ["Juan José Flores", "Vicente Rocafuerte", "Gabriel García Moreno", "Eloy Alfaro"],
    respuesta: 2,
    explicacion: "Gabriel García Moreno gobernó Ecuador con un enfoque conservador y católico, promoviendo la educación religiosa y obras públicas. Fue asesinado el 6 de agosto de 1875 frente al Palacio de Gobierno en Quito."
  },
  {
    id: 105,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Cuál fue una de las principales reformas impulsadas por la Revolución Liberal de Eloy Alfaro?",
    opciones: ["Establecimiento del voto censitario", "Creación del Banco Central del Ecuador", "Adopción del dólar como moneda oficial", "Separación de la Iglesia y el Estado y la educación laica"],
    respuesta: 3,
    explicacion: "La Revolución Liberal impulsó la separación Iglesia-Estado, la educación laica y gratuita, la creación del registro civil, la construcción del ferrocarril Guayaquil-Quito y avances en los derechos de la mujer."
  },
  {
    id: 106,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Qué movimiento de 1925 en Ecuador fue protagonizado por jóvenes militares contra la influencia de la banca en la política nacional?",
    opciones: ["Revolución Marcista", "Revolución Juliana", "Revolución Ciudadana", "Revolución de los Estancos"],
    respuesta: 1,
    explicacion: "La Revolución Juliana del 9 de julio de 1925 fue un golpe militar liderado por jóvenes oficiales contra la plutocracia bancaria guayaquileña, buscando modernizar el Estado ecuatoriano y proteger a los sectores populares."
  },
  {
    id: 107,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Cuántas veces fue presidente del Ecuador José María Velasco Ibarra, líder populista conocido por la frase 'Dadme un balcón y seré presidente'?",
    opciones: ["Cinco veces", "Tres veces", "Cuatro veces", "Seis veces"],
    respuesta: 0,
    explicacion: "Velasco Ibarra fue presidente cinco veces (1934-1935, 1944-1947, 1952-1956, 1960-1961 y 1968-1972), siendo el mandatario que más veces ocupó la presidencia en la historia del Ecuador. Solo completó uno de sus mandatos."
  },
  {
    id: 108,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "¿Quién fue el primer presidente del Ecuador tras el retorno a la democracia en 1979?",
    opciones: ["León Febres-Cordero", "Rodrigo Borja", "Osvaldo Hurtado", "Jaime Roldós Aguilera"],
    respuesta: 3,
    explicacion: "Jaime Roldós Aguilera asumió la presidencia el 10 de agosto de 1979, marcando el retorno a la democracia tras años de dictadura militar. Falleció trágicamente en un accidente aéreo el 24 de mayo de 1981."
  },
  {
    id: 109,
    area: "sociales",
    subtema: "Historia del Ecuador: Revolución liberal y democracia",
    pregunta: "Vicente Rocafuerte, segundo presidente del Ecuador (1835-1839), se destacó principalmente por:",
    opciones: ["Impulsar la educación pública y la modernización del Estado", "Establecer el catolicismo como única religión oficial", "Declarar la guerra a la Gran Colombia", "Anexar militarmente las Islas Galápagos"],
    respuesta: 0,
    explicacion: "Vicente Rocafuerte fue un político liberal que promovió la educación pública, la libertad de prensa y la modernización institucional del Ecuador durante su gobierno, sentando bases para el desarrollo del país."
  },

  // =====================================================
  // HISTORIA UNIVERSAL: REVOLUCIÓN FRANCESA Y GUERRAS MUNDIALES
  // (9 preguntas: IDs 110–118)
  // =====================================================
  {
    id: 110,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué filósofo de la Ilustración propuso la separación de poderes del Estado en ejecutivo, legislativo y judicial?",
    opciones: ["Voltaire", "Jean-Jacques Rousseau", "Montesquieu", "Denis Diderot"],
    respuesta: 2,
    explicacion: "Montesquieu, en su obra 'El espíritu de las leyes' (1748), propuso la división del poder estatal en tres ramas independientes —ejecutivo, legislativo y judicial— para evitar la tiranía y garantizar la libertad."
  },
  {
    id: 111,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Cuál fue el evento que simbolizó el inicio de la Revolución Francesa el 14 de julio de 1789?",
    opciones: ["La toma de la Bastilla", "La ejecución de Luis XVI", "La Declaración de los Derechos del Hombre", "El golpe de Estado de Napoleón"],
    respuesta: 0,
    explicacion: "La toma de la Bastilla, una fortaleza-prisión que simbolizaba el poder absolutista de la monarquía, es considerada el inicio de la Revolución Francesa. El 14 de julio se celebra como fiesta nacional de Francia."
  },
  {
    id: 112,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué pensador de la Ilustración escribió 'El contrato social' (1762) y defendió la soberanía popular?",
    opciones: ["Voltaire", "Montesquieu", "Denis Diderot", "Jean-Jacques Rousseau"],
    respuesta: 3,
    explicacion: "Jean-Jacques Rousseau publicó 'El contrato social' en 1762, donde sostenía que la legitimidad política se basa en la voluntad general del pueblo y que el ser humano nace libre pero la sociedad lo encadena."
  },
  {
    id: 113,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Cuál fue una de las principales causas socioeconómicas de la Revolución Francesa de 1789?",
    opciones: ["La invasión de Inglaterra a territorio francés", "La desigualdad entre los tres estados y la grave crisis fiscal de la monarquía", "El descubrimiento de nuevas rutas comerciales", "La independencia de las colonias africanas"],
    respuesta: 1,
    explicacion: "La sociedad francesa estaba dividida en tres estados: clero, nobleza y Tercer Estado (pueblo). La enorme desigualdad fiscal —ya que los privilegiados no pagaban impuestos— y la crisis económica de la corona provocaron el estallido revolucionario."
  },
  {
    id: 114,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿En qué país comenzó la Revolución Industrial en la segunda mitad del siglo XVIII?",
    opciones: ["Francia", "Alemania", "Estados Unidos", "Inglaterra"],
    respuesta: 3,
    explicacion: "La Revolución Industrial comenzó en Inglaterra gracias a factores como la acumulación de capital, abundantes recursos naturales (carbón y hierro), innovaciones tecnológicas como la máquina de vapor y un sistema político estable."
  },
  {
    id: 115,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué evento fue el detonante inmediato de la Primera Guerra Mundial en 1914?",
    opciones: ["La invasión de Polonia por Alemania", "El asesinato del archiduque Francisco Fernando de Austria en Sarajevo", "El hundimiento del Lusitania", "La firma del Tratado de Versalles"],
    respuesta: 1,
    explicacion: "El asesinato del archiduque Francisco Fernando de Austria-Hungría el 28 de junio de 1914 en Sarajevo, a manos del nacionalista serbio Gavrilo Princip, desencadenó una serie de alianzas que llevaron al estallido de la Primera Guerra Mundial."
  },
  {
    id: 116,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué tratado, firmado en 1919, impuso severas condiciones a Alemania tras la Primera Guerra Mundial?",
    opciones: ["Tratado de Versalles", "Tratado de Tordesillas", "Tratado de Westfalia", "Tratado de Utrecht"],
    respuesta: 0,
    explicacion: "El Tratado de Versalles (28 de junio de 1919) responsabilizó a Alemania de la guerra, imponiéndole pérdidas territoriales, desarme militar y el pago de cuantiosas reparaciones económicas. Este resentimiento contribuyó al surgimiento del nazismo."
  },
  {
    id: 117,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué organismo internacional se creó en 1945, tras la Segunda Guerra Mundial, para mantener la paz y la seguridad internacional?",
    opciones: ["La Unión Europea", "La Sociedad de Naciones", "La Organización de las Naciones Unidas (ONU)", "La OTAN"],
    respuesta: 2,
    explicacion: "La ONU fue fundada el 24 de octubre de 1945 con el objetivo de mantener la paz mundial, promover la cooperación internacional y proteger los derechos humanos. La Sociedad de Naciones, creada tras la Primera Guerra Mundial, había fracasado en este propósito."
  },
  {
    id: 118,
    area: "sociales",
    subtema: "Historia universal: Revolución Francesa y guerras mundiales",
    pregunta: "¿Qué caracterizó principalmente a la Guerra Fría (1947-1991)?",
    opciones: ["Un conflicto armado directo entre Estados Unidos y la Unión Soviética", "Una guerra civil en Europa del Este", "Un conflicto entre China y Japón por el control del Pacífico", "La confrontación ideológica, política y militar indirecta entre Estados Unidos y la Unión Soviética"],
    respuesta: 3,
    explicacion: "La Guerra Fría fue un periodo de tensión entre el bloque capitalista (EE.UU.) y el bloque comunista (URSS), sin enfrentamiento directo entre ambas potencias, pero con guerras proxy, carrera armamentista y carrera espacial. Terminó con la disolución de la URSS en 1991."
  },

  // =====================================================
  // DERECHOS HUMANOS Y CIUDADANÍA
  // (8 preguntas: IDs 119–126)
  // =====================================================
  {
    id: 119,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "¿En qué fecha fue aprobada la Declaración Universal de los Derechos Humanos (DUDH) por la Asamblea General de la ONU?",
    opciones: ["24 de octubre de 1945", "26 de junio de 1945", "10 de diciembre de 1948", "1 de enero de 1950"],
    respuesta: 2,
    explicacion: "La DUDH fue adoptada por la Asamblea General de las Naciones Unidas el 10 de diciembre de 1948 en París, fecha que se conmemora cada año como el Día Internacional de los Derechos Humanos."
  },
  {
    id: 120,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "¿Cuántos artículos contiene la Declaración Universal de los Derechos Humanos?",
    opciones: ["15 artículos", "20 artículos", "25 artículos", "30 artículos"],
    respuesta: 3,
    explicacion: "La DUDH contiene 30 artículos que abarcan derechos civiles, políticos, económicos, sociales y culturales de todas las personas, sin distinción de raza, sexo, idioma, religión u otra condición."
  },
  {
    id: 121,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "La Constitución del Ecuador de 2008, aprobada en Montecristi, reconoce al país como un Estado:",
    opciones: ["Federal y descentralizado", "Plurinacional e intercultural", "Unitario y monocultural", "Confederado y autónomo"],
    respuesta: 1,
    explicacion: "La Constitución de Montecristi (2008) define al Ecuador como un Estado constitucional de derechos y justicia, social, democrático, soberano, independiente, unitario, intercultural, plurinacional y laico."
  },
  {
    id: 122,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "¿Qué concepto innovador, incorporado en la Constitución de Ecuador de 2008, reconoce a la naturaleza como sujeto de derechos?",
    opciones: ["Desarrollo sostenible", "Derecho ambiental internacional", "Justicia restaurativa", "Derechos de la Pachamama (Naturaleza)"],
    respuesta: 3,
    explicacion: "Ecuador fue el primer país del mundo en reconocer constitucionalmente los derechos de la naturaleza (Pachamama), estableciendo su derecho a que se respete integralmente su existencia, mantenimiento y regeneración de sus ciclos vitales."
  },
  {
    id: 123,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "Los derechos de primera generación, también llamados derechos civiles y políticos, incluyen:",
    opciones: ["Derecho a la vida, la libertad y la igualdad ante la ley", "Derecho al trabajo y a la seguridad social", "Derecho a un medio ambiente sano", "Derecho a la educación intercultural bilingüe"],
    respuesta: 0,
    explicacion: "Los derechos de primera generación son los derechos civiles y políticos, surgidos de las revoluciones liberales: derecho a la vida, la libertad, la seguridad personal, la igualdad ante la ley, la libertad de expresión y el derecho al voto."
  },
  {
    id: 124,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "¿Qué diferencia existe entre los conceptos de equidad e igualdad?",
    opciones: ["Son conceptos idénticos sin diferencia alguna", "La equidad se aplica solo en economía y la igualdad solo en derecho", "La igualdad implica dar a todos lo mismo; la equidad, dar a cada quien según su necesidad para alcanzar condiciones justas", "La equidad es dar a todos lo mismo; la igualdad, dar según la necesidad"],
    respuesta: 2,
    explicacion: "La igualdad busca tratar a todos de la misma manera, mientras que la equidad reconoce las diferencias individuales y busca dar a cada persona lo que necesita para alcanzar condiciones justas e igualdad real de oportunidades."
  },
  {
    id: 125,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "La participación ciudadana en el Ecuador, según la Constitución de 2008, incluye mecanismos como:",
    opciones: ["Solo el voto en elecciones presidenciales cada cuatro años", "La consulta popular, la revocatoria del mandato y la iniciativa popular normativa", "Únicamente la presentación de quejas en instituciones públicas", "La participación exclusiva a través de partidos políticos registrados"],
    respuesta: 1,
    explicacion: "La Constitución ecuatoriana establece diversos mecanismos de democracia directa como la consulta popular, la revocatoria del mandato, la iniciativa popular normativa, el presupuesto participativo y la silla vacía en gobiernos locales."
  },
  {
    id: 126,
    area: "sociales",
    subtema: "Derechos humanos y ciudadanía",
    pregunta: "¿Cuál de los siguientes es un derecho de las personas con discapacidad reconocido en la Constitución ecuatoriana?",
    opciones: ["La inclusión social y laboral con igualdad de oportunidades", "Recibir atención únicamente en centros especializados segregados", "La exención total de impuestos sin importar su nivel de ingresos", "La educación exclusivamente en instituciones separadas del sistema regular"],
    respuesta: 0,
    explicacion: "La Constitución ecuatoriana garantiza a las personas con discapacidad la inclusión social, laboral y educativa, la accesibilidad universal, la atención especializada y la igualdad de oportunidades, promoviendo una sociedad verdaderamente inclusiva."
  },

  // =====================================================
  // FILOSOFÍA POLÍTICA Y PENSAMIENTO CRÍTICO SOCIAL
  // (8 preguntas: IDs 127–134)
  // =====================================================
  {
    id: 127,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "Según Thomas Hobbes, en su obra 'Leviatán' (1651), el estado natural del ser humano sin gobierno se caracteriza por:",
    opciones: ["La cooperación pacífica entre individuos", "El predominio de la razón sobre los instintos", "Una guerra de todos contra todos", "La democracia directa y natural"],
    respuesta: 2,
    explicacion: "Hobbes sostenía que en el estado de naturaleza la vida sería 'solitaria, pobre, desagradable, brutal y corta', por lo que los individuos ceden sus libertades a un soberano absoluto (Leviatán) para garantizar la paz y la seguridad."
  },
  {
    id: 128,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "¿Qué filósofo es considerado padre del liberalismo político y defendió los derechos naturales a la vida, la libertad y la propiedad?",
    opciones: ["Karl Marx", "Thomas Hobbes", "Friedrich Nietzsche", "John Locke"],
    respuesta: 3,
    explicacion: "John Locke, en sus 'Dos tratados sobre el gobierno civil' (1689), postuló que las personas poseen derechos naturales inalienables y que el gobierno legítimo existe para proteger la vida, la libertad y la propiedad de los ciudadanos."
  },
  {
    id: 129,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "¿Cuál es la idea central del marxismo respecto a la historia y la sociedad?",
    opciones: ["La historia avanza por la voluntad divina", "La lucha de clases es el motor de la historia", "El progreso depende exclusivamente del avance tecnológico", "El individuo es siempre más importante que la colectividad"],
    respuesta: 1,
    explicacion: "Karl Marx sostenía que la historia de todas las sociedades es la historia de la lucha de clases, entre quienes poseen los medios de producción (burguesía) y quienes venden su fuerza de trabajo (proletariado), lo cual impulsa los cambios sociales."
  },
  {
    id: 130,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "El contractualismo es una corriente filosófica que sostiene que:",
    opciones: ["La sociedad y el Estado surgen de un acuerdo o pacto voluntario entre los individuos", "El poder político proviene exclusivamente de la divinidad", "La naturaleza humana es completamente inalterable", "Los seres humanos no necesitan ninguna forma de gobierno"],
    respuesta: 0,
    explicacion: "El contractualismo, desarrollado por Hobbes, Locke y Rousseau, plantea que el Estado es producto de un contrato social mediante el cual los individuos acuerdan vivir bajo reglas comunes, cediendo parte de su libertad a cambio de orden y protección."
  },
  {
    id: 131,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "El movimiento feminista, en su primera ola (siglos XIX-XX), se enfocó principalmente en:",
    opciones: ["La igualdad salarial y los derechos reproductivos", "El derecho al sufragio femenino y la igualdad jurídica", "La deconstrucción del género como categoría social", "La interseccionalidad y la diversidad sexual"],
    respuesta: 1,
    explicacion: "La primera ola del feminismo (siglos XIX y principios del XX) se centró en la lucha por el derecho al voto de las mujeres (sufragismo) y la igualdad de derechos legales, como el acceso a la educación y a la propiedad."
  },
  {
    id: 132,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "¿Qué implica el pensamiento crítico en el análisis de la realidad social?",
    opciones: ["Aceptar sin cuestionar la información de los medios de comunicación", "Rechazar automáticamente toda información proveniente de fuentes oficiales", "Evaluar la información de forma racional, identificando sesgos, argumentos y evidencias antes de formar un juicio", "Basarse únicamente en las emociones y opiniones personales"],
    respuesta: 2,
    explicacion: "El pensamiento crítico es la capacidad de analizar, evaluar y cuestionar la información de manera racional y fundamentada, considerando múltiples perspectivas y fuentes antes de llegar a conclusiones propias."
  },
  {
    id: 133,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "Según Montesquieu, ¿por qué es necesaria la separación de poderes en un Estado?",
    opciones: ["Para concentrar el poder y hacer más eficiente al gobierno", "Para eliminar el poder judicial y simplificar la administración", "Para que el ejecutivo controle directamente al legislativo", "Para evitar la tiranía y garantizar la libertad de los ciudadanos"],
    respuesta: 3,
    explicacion: "Montesquieu argumentaba que la concentración del poder en una sola persona o institución conduce inevitablemente a la tiranía. La separación en ejecutivo, legislativo y judicial permite que cada poder limite y controle a los otros, protegiendo así la libertad."
  },
  {
    id: 134,
    area: "sociales",
    subtema: "Filosofía política y pensamiento crítico social",
    pregunta: "¿Qué corriente de la filosofía política defiende la libertad individual, la propiedad privada y el libre mercado como bases de la organización social?",
    opciones: ["Liberalismo", "Marxismo", "Anarquismo", "Teocracia"],
    respuesta: 0,
    explicacion: "El liberalismo, desarrollado por pensadores como John Locke y Adam Smith, defiende las libertades individuales, la propiedad privada, el Estado de derecho y la economía de mercado como pilares fundamentales de la organización social y política."
  },

  // =====================================================
  // HISTORIA SOCIAL Y CULTURAL
  // (8 preguntas: IDs 135–142)
  // =====================================================
  {
    id: 135,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Cuántas nacionalidades indígenas reconoce la Constitución del Ecuador?",
    opciones: ["5 nacionalidades", "25 nacionalidades", "14 nacionalidades", "50 nacionalidades"],
    respuesta: 2,
    explicacion: "La Constitución ecuatoriana reconoce 14 nacionalidades indígenas (entre ellas Kichwa, Shuar, Achuar, Waorani, Tsáchila, Chachi, Epera, Cofán, Siona, Secoya, Shiwiar, Zápara, Andoa y Sapara) y diversos pueblos dentro de ellas."
  },
  {
    id: 136,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "El concepto del Sumak Kawsay o Buen Vivir, incorporado en la Constitución de 2008, proviene de:",
    opciones: ["La tradición filosófica europea ilustrada", "La cosmovisión de los pueblos indígenas andinos", "El pensamiento liberal norteamericano", "La doctrina social de la Iglesia católica"],
    respuesta: 1,
    explicacion: "El Sumak Kawsay (Buen Vivir) es un principio de la cosmovisión andina kichwa que propone una vida en armonía con la comunidad, la naturaleza y la espiritualidad, como alternativa al modelo de desarrollo basado únicamente en el crecimiento económico."
  },
  {
    id: 137,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Qué ciudad ecuatoriana fue declarada Patrimonio Cultural de la Humanidad por la UNESCO en 1978, siendo una de las primeras del mundo en recibir esa distinción?",
    opciones: ["Quito", "Guayaquil", "Cuenca", "Loja"],
    respuesta: 0,
    explicacion: "Quito fue declarada Patrimonio Cultural de la Humanidad por la UNESCO en septiembre de 1978, junto con Cracovia (Polonia), siendo una de las primeras ciudades del mundo en recibir esta distinción, gracias a su extraordinario centro histórico colonial."
  },
  {
    id: 138,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Qué pueblo del Ecuador, especialmente presente en la provincia de Esmeraldas, es reconocido por su rica tradición musical que incluye la marimba y los arrullos?",
    opciones: ["Pueblo Montubio", "Pueblo Otavalo", "Pueblo Salasaca", "Pueblo Afroecuatoriano"],
    respuesta: 3,
    explicacion: "El pueblo Afroecuatoriano, especialmente en Esmeraldas, posee una rica tradición cultural que incluye la marimba de chonta, los arrullos, los chigualos, los alabados y otras expresiones musicales y culturales reconocidas como patrimonio inmaterial."
  },
  {
    id: 139,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Qué es la interculturalidad en el contexto ecuatoriano?",
    opciones: ["La imposición de una cultura dominante sobre las demás", "El diálogo y convivencia respetuosa entre diferentes culturas en condiciones de igualdad", "El aislamiento de cada grupo cultural en su propio territorio", "La asimilación obligatoria de culturas minoritarias por la cultura mayoritaria"],
    respuesta: 1,
    explicacion: "La interculturalidad promueve el diálogo, el respeto mutuo y la convivencia entre diversas culturas en igualdad de condiciones, superando el simple reconocimiento de la diversidad (multiculturalidad) hacia una interacción constructiva y enriquecedora."
  },
  {
    id: 140,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "Los pueblos montubios del Ecuador, reconocidos constitucionalmente en 2008, se ubican principalmente en:",
    opciones: ["La Sierra norte andina", "La región amazónica", "La región costera (litoral)", "Las Islas Galápagos"],
    respuesta: 2,
    explicacion: "Los montubios son un pueblo mestizo de la costa ecuatoriana, reconocidos en la Constitución de 2008. Se caracterizan por sus tradiciones como los rodeos montubios, los amorfinos (coplas populares) y su estrecho vínculo con la agricultura y la ganadería."
  },
  {
    id: 141,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Qué instrumento musical, declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2015, es emblemático de la cultura afroecuatoriana de Esmeraldas?",
    opciones: ["La quena", "El rondador andino", "El charango", "La marimba de chonta"],
    respuesta: 3,
    explicacion: "La marimba de chonta y los cantos y danzas tradicionales que la acompañan fueron inscritos en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2015, representando la riqueza cultural afroecuatoriana y afrocolombiana."
  },
  {
    id: 142,
    area: "sociales",
    subtema: "Historia social y cultural",
    pregunta: "¿Qué se entiende por patrimonio cultural inmaterial?",
    opciones: ["Las tradiciones, saberes, fiestas, lenguas y expresiones orales transmitidas de generación en generación", "Únicamente los monumentos y edificios históricos de un país", "Solo los objetos arqueológicos conservados en museos", "Las leyes y normativas vigentes de un Estado"],
    respuesta: 0,
    explicacion: "El patrimonio cultural inmaterial incluye tradiciones orales, artes escénicas, rituales, festividades, conocimientos ancestrales y técnicas artesanales que una comunidad transmite de generación en generación como parte fundamental de su identidad cultural."
  },

  // =====================================================
  // ÉTICA Y RESPONSABILIDAD SOCIAL
  // (8 preguntas: IDs 143–150)
  // =====================================================
  {
    id: 143,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "¿Cuál es la diferencia fundamental entre ética y moral?",
    opciones: ["Son sinónimos que significan exactamente lo mismo", "La moral es universal y la ética es individual", "La ética estudia y reflexiona filosóficamente sobre la moral; la moral son las normas y costumbres aceptadas en una sociedad", "La ética se refiere a las leyes escritas y la moral a las costumbres religiosas"],
    respuesta: 2,
    explicacion: "La moral se refiere al conjunto de normas, valores y costumbres que regulan la conducta en una sociedad determinada. La ética es la rama de la filosofía que reflexiona críticamente sobre esos principios morales, analizando qué es lo correcto y por qué."
  },
  {
    id: 144,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "¿Qué es la bioética?",
    opciones: ["El estudio biológico de los ecosistemas", "Un movimiento ecologista radical contemporáneo", "Una corriente religiosa sobre el origen de la vida", "La rama de la ética que estudia los dilemas morales relacionados con la vida, la salud y las ciencias biomédicas"],
    respuesta: 3,
    explicacion: "La bioética es una disciplina que analiza los dilemas éticos surgidos de los avances en ciencias de la vida y la medicina, como la eutanasia, la clonación, la experimentación con seres humanos, los trasplantes de órganos y la ingeniería genética."
  },
  {
    id: 145,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "La responsabilidad social empresarial (RSE) se refiere a:",
    opciones: ["La obligación de las empresas de maximizar ganancias sin importar las consecuencias", "El compromiso voluntario de las empresas de contribuir al bienestar social y ambiental más allá de sus obligaciones legales", "La política de contratar solo a familiares de los directivos", "Una ley que obliga a donar el 50 % de las ganancias al Estado"],
    respuesta: 1,
    explicacion: "La RSE implica que las empresas asuman un compromiso ético con la sociedad y el medio ambiente, integrando preocupaciones sociales y ambientales en sus operaciones comerciales y relaciones con todos sus grupos de interés."
  },
  {
    id: 146,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "¿Cuál de los siguientes es uno de los cuatro principios fundamentales de la bioética?",
    opciones: ["El principio de autonomía, que respeta la capacidad de decisión del paciente", "El principio de máximo beneficio económico para el médico", "El principio de obediencia absoluta al criterio médico", "El principio de confidencialidad solo para pacientes con recursos económicos"],
    respuesta: 0,
    explicacion: "La bioética se fundamenta en cuatro principios: autonomía (respeto a las decisiones del paciente), beneficencia (hacer el bien), no maleficencia (no causar daño) y justicia (distribución equitativa de recursos y atención sanitaria)."
  },
  {
    id: 147,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "Un dilema ético se caracteriza por:",
    opciones: ["Tener siempre una solución clara, evidente e indiscutible", "Presentar una situación donde se debe elegir entre dos o más opciones moralmente conflictivas", "Ser un problema exclusivamente de carácter legal", "No requerir reflexión ni análisis de ningún tipo"],
    respuesta: 1,
    explicacion: "Un dilema ético surge cuando una persona enfrenta una situación en la que debe elegir entre opciones que implican valores morales en conflicto, sin que exista una respuesta claramente correcta, lo que requiere reflexión y análisis ético profundo."
  },
  {
    id: 148,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "¿Qué implica la responsabilidad social individual en la vida cotidiana?",
    opciones: ["Preocuparse exclusivamente por el bienestar propio y familiar", "Cumplir solo con las leyes sin necesidad de considerar valores éticos", "Actuar de manera consciente considerando el impacto de nuestras acciones en la comunidad y el entorno", "Delegar toda responsabilidad social al Estado y sus instituciones"],
    respuesta: 2,
    explicacion: "La responsabilidad social individual implica que cada persona es consciente del efecto de sus decisiones y acciones en los demás y en el medio ambiente, actuando de forma ética, solidaria y comprometida en su vida cotidiana."
  },
  {
    id: 149,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "Según la ética de Immanuel Kant, ¿qué principio establece que debemos actuar de modo que nuestra acción pueda convertirse en ley universal?",
    opciones: ["El utilitarismo", "El relativismo moral", "El hedonismo", "El imperativo categórico"],
    respuesta: 3,
    explicacion: "Immanuel Kant formuló el imperativo categórico como principio moral fundamental: 'Obra solo según aquella máxima por la cual puedas querer al mismo tiempo que se convierta en ley universal'. Esto significa actuar según principios que desearíamos que todas las personas siguieran."
  },
  {
    id: 150,
    area: "sociales",
    subtema: "Ética y responsabilidad social",
    pregunta: "¿Cuál es un ejemplo de dilema ético relevante en el ámbito de la tecnología contemporánea?",
    opciones: ["El uso de inteligencia artificial para la vigilancia masiva versus el derecho a la privacidad individual", "Decidir qué color utilizar en el diseño de una página web", "Elegir entre dos marcas de computadoras portátiles", "Instalar una actualización de un programa de ofimática"],
    respuesta: 0,
    explicacion: "El desarrollo tecnológico plantea dilemas éticos complejos como el equilibrio entre seguridad pública y privacidad personal, el uso ético de la inteligencia artificial, la protección de datos personales y la responsabilidad por decisiones automatizadas que afectan a las personas."
  }
];

const PREGUNTAS_NATURALES = [
  // ═══════════════════════════════════════════════════════════════
  // BIOLOGÍA CELULAR Y SISTEMAS DEL CUERPO HUMANO (151-160)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 151,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Qué tipo de vaso sanguíneo transporta la sangre desde el corazón hacia los tejidos del cuerpo?",
    opciones: ["Arteria", "Vena", "Capilar", "Vénula"],
    respuesta: 0,
    explicacion: "Las arterias son los vasos sanguíneos que llevan la sangre desde el corazón hacia los tejidos. Las venas realizan el recorrido inverso, devolviendo la sangre al corazón."
  },
  {
    id: 152,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Qué tipo de división celular produce gametos (óvulos y espermatozoides) con la mitad del número de cromosomas?",
    opciones: ["Mitosis", "Meiosis", "Fisión binaria", "Gemación"],
    respuesta: 1,
    explicacion: "La meiosis es la división celular que reduce el número de cromosomas a la mitad (células haploides), generando gametos para la reproducción sexual. La mitosis produce células idénticas con el mismo número de cromosomas."
  },
  {
    id: 153,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Cuál es el organelo celular encargado de la respiración celular y la producción de ATP?",
    opciones: ["Aparato de Golgi", "Ribosoma", "Mitocondria", "Lisosoma"],
    respuesta: 2,
    explicacion: "La mitocondria es conocida como la 'central energética' de la célula, ya que realiza la respiración celular aeróbica para producir ATP (adenosín trifosfato), la principal molécula de energía celular."
  },
  {
    id: 154,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Cuál es la molécula que almacena la información genética en las células y tiene estructura de doble hélice?",
    opciones: ["ARN mensajero", "Proteína", "ADN", "ATP"],
    respuesta: 2,
    explicacion: "El ADN (ácido desoxirribonucleico) es la molécula que almacena la información genética. Su estructura de doble hélice fue descrita por Watson y Crick en 1953. El ARN es de cadena simple y participa en la expresión de genes."
  },
  {
    id: 155,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Cuál es la función principal del ARN mensajero (ARNm) en la célula?",
    opciones: ["Almacenar energía en forma de glucógeno", "Transportar la información genética del ADN al ribosoma para la síntesis de proteínas", "Formar la estructura de la membrana celular", "Catalizar reacciones metabólicas en el citoplasma"],
    respuesta: 1,
    explicacion: "El ARN mensajero (ARNm) copia la información del ADN en el núcleo (transcripción) y la lleva a los ribosomas en el citoplasma, donde se traduce en una secuencia de aminoácidos para sintetizar proteínas."
  },
  {
    id: 156,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "Durante la mitosis, ¿en qué fase los cromosomas se alinean en el plano ecuatorial de la célula?",
    opciones: ["Profase", "Metafase", "Anafase", "Telofase"],
    respuesta: 1,
    explicacion: "En la metafase, los cromosomas se alinean en el plano ecuatorial (centro) de la célula, unidos al huso mitótico por sus centrómeros, antes de separarse en la anafase."
  },
  {
    id: 157,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Cuál es la unidad funcional básica del sistema nervioso encargada de transmitir impulsos eléctricos?",
    opciones: ["Eritrocito", "Neurona", "Osteocito", "Hepatocito"],
    respuesta: 1,
    explicacion: "La neurona es la célula especializada del sistema nervioso que transmite impulsos eléctricos (potenciales de acción). Está compuesta por el cuerpo celular (soma), dendritas y axón."
  },
  {
    id: 158,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Qué glándula del sistema endocrino produce la insulina, hormona que regula los niveles de glucosa en sangre?",
    opciones: ["Tiroides", "Hipófisis", "Páncreas", "Suprarrenal"],
    respuesta: 2,
    explicacion: "El páncreas, específicamente las células beta de los islotes de Langerhans, produce insulina. Esta hormona permite que las células absorban glucosa de la sangre, regulando la glucemia. Su deficiencia causa diabetes."
  },
  {
    id: 159,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿En qué órgano del sistema digestivo se absorbe la mayor parte de los nutrientes de los alimentos?",
    opciones: ["Estómago", "Intestino delgado", "Intestino grueso", "Esófago"],
    respuesta: 1,
    explicacion: "El intestino delgado es el principal sitio de absorción de nutrientes gracias a sus vellosidades intestinales, que aumentan enormemente la superficie de absorción. El intestino grueso absorbe principalmente agua y electrolitos."
  },
  {
    id: 160,
    area: "naturales",
    subtema: "Biología celular y sistemas del cuerpo humano",
    pregunta: "¿Qué tipo de tejido conectivo especializado forma el esqueleto humano y sirve de soporte y protección a los órganos?",
    opciones: ["Tejido muscular", "Tejido epitelial", "Tejido óseo", "Tejido nervioso"],
    respuesta: 2,
    explicacion: "El tejido óseo es un tejido conectivo especializado que forma los huesos del esqueleto. Proporciona soporte estructural, protección de órganos vitales, almacenamiento de minerales (calcio y fósforo) y alberga la médula ósea donde se producen células sanguíneas."
  },

  // ═══════════════════════════════════════════════════════════════
  // BIODIVERSIDAD Y SISTEMAS VIVOS (161-168)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 161,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "¿Cómo se denomina el conjunto de organismos de diferentes especies que conviven en un área determinada junto con su ambiente físico?",
    opciones: ["Población", "Comunidad", "Ecosistema", "Bioma"],
    respuesta: 2,
    explicacion: "Un ecosistema es el conjunto de organismos vivos (componente biótico) y su ambiente físico (componente abiótico) que interactúan entre sí en un área determinada. Una población es un grupo de individuos de la misma especie; una comunidad agrupa varias poblaciones."
  },
  {
    id: 162,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "En una cadena trófica, ¿qué nivel ocupan los organismos que obtienen energía alimentándose de herbívoros?",
    opciones: ["Productores", "Consumidores primarios", "Consumidores secundarios", "Descomponedores"],
    respuesta: 2,
    explicacion: "Los consumidores secundarios son carnívoros que se alimentan de herbívoros (consumidores primarios). Los productores son organismos autótrofos (plantas), y los consumidores primarios son herbívoros que se alimentan directamente de los productores."
  },
  {
    id: 163,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "Según la clasificación taxonómica, ¿cuál es la categoría más específica que agrupa a organismos capaces de reproducirse entre sí y producir descendencia fértil?",
    opciones: ["Género", "Familia", "Especie", "Orden"],
    respuesta: 2,
    explicacion: "La especie es la categoría taxonómica más específica y se define como el grupo de organismos que pueden reproducirse entre sí y producir descendencia fértil. La jerarquía de mayor a menor es: dominio, reino, filo, clase, orden, familia, género, especie."
  },
  {
    id: 164,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "¿Qué animales endémicos de las islas Galápagos estudió Charles Darwin y fueron clave para su teoría de la evolución por selección natural?",
    opciones: ["Cóndores andinos", "Pinzones de Darwin", "Osos de anteojos", "Colibríes picoespada"],
    respuesta: 1,
    explicacion: "Los pinzones de Darwin son aves endémicas de las islas Galápagos cuya variación en la forma del pico entre las diferentes islas fue evidencia fundamental para la teoría de la evolución por selección natural."
  },
  {
    id: 165,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "¿Cuál es el proceso mediante el cual las plantas convierten dióxido de carbono y agua en glucosa y oxígeno utilizando la energía solar?",
    opciones: ["Respiración celular", "Fotosíntesis", "Fermentación", "Quimiosíntesis"],
    respuesta: 1,
    explicacion: "La fotosíntesis es el proceso por el cual las plantas y otros organismos autótrofos convierten CO₂ y H₂O en glucosa (C₆H₁₂O₆) y O₂, usando la energía lumínica captada por la clorofila en los cloroplastos."
  },
  {
    id: 166,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "Ecuador es considerado uno de los países megadiversos del planeta. ¿Cuál de sus regiones naturales alberga la mayor diversidad de especies?",
    opciones: ["Región Costa", "Región Sierra", "Región Amazónica", "Región Insular"],
    respuesta: 2,
    explicacion: "La Amazonía ecuatoriana alberga la mayor biodiversidad del país y una de las más altas del mundo, con miles de especies de plantas, aves, mamíferos, reptiles, anfibios e insectos en sus bosques tropicales húmedos."
  },
  {
    id: 167,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "¿Qué tipo de organismos se encuentran en la base de la mayoría de las cadenas tróficas marinas?",
    opciones: ["Peces grandes depredadores", "Fitoplancton", "Crustáceos", "Mamíferos marinos"],
    respuesta: 1,
    explicacion: "El fitoplancton (microalgas y cianobacterias) son los productores primarios del océano. Realizan fotosíntesis y constituyen la base de las cadenas tróficas marinas, produciendo además gran parte del oxígeno atmosférico."
  },
  {
    id: 168,
    area: "naturales",
    subtema: "Biodiversidad y sistemas vivos",
    pregunta: "¿A qué reino pertenecen los organismos unicelulares procariotas como las bacterias?",
    opciones: ["Protista", "Fungi", "Monera", "Plantae"],
    respuesta: 2,
    explicacion: "El reino Monera (en la clasificación de cinco reinos de Whittaker) agrupa a todos los organismos procariotas, es decir, aquellos que carecen de núcleo definido, como las bacterias y las cianobacterias."
  },

  // ═══════════════════════════════════════════════════════════════
  // SISTEMA INMUNE Y SALUD PÚBLICA BÁSICA (169-176)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 169,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Qué tipo de células del sistema inmunológico son atacadas y destruidas por el virus de inmunodeficiencia humana (VIH)?",
    opciones: ["Eritrocitos", "Plaquetas", "Linfocitos T CD4+", "Neuronas"],
    respuesta: 2,
    explicacion: "El VIH ataca y destruye los linfocitos T CD4+ (células T auxiliares), fundamentales para coordinar la respuesta inmunitaria. Su destrucción progresiva debilita el sistema inmune, pudiendo evolucionar a SIDA."
  },
  {
    id: 170,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Qué tipo de células del sistema inmunitario son las responsables de producir anticuerpos?",
    opciones: ["Linfocitos T citotóxicos", "Linfocitos B", "Macrófagos", "Neutrófilos"],
    respuesta: 1,
    explicacion: "Los linfocitos B, al activarse frente a un antígeno, se diferencian en células plasmáticas que producen anticuerpos (inmunoglobulinas). Estos anticuerpos se unen específicamente a los antígenos para neutralizarlos o marcarlos para su destrucción."
  },
  {
    id: 171,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿De qué fuente natural se descubrieron originalmente los antibióticos como la penicilina?",
    opciones: ["Plantas medicinales tropicales", "Minerales del subsuelo", "Microorganismos del suelo (hongos y bacterias)", "Veneno de serpientes"],
    respuesta: 2,
    explicacion: "Los antibióticos se descubrieron a partir de microorganismos del suelo. Alexander Fleming descubrió la penicilina en 1928 a partir del hongo Penicillium notatum. Muchos otros antibióticos provienen de bacterias del género Streptomyces halladas en el suelo."
  },
  {
    id: 172,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Cuál es el principio por el cual funcionan las vacunas para proteger contra enfermedades infecciosas?",
    opciones: ["Eliminan directamente todos los patógenos del cuerpo", "Estimulan la producción de glóbulos rojos", "Introducen antígenos debilitados o inactivados para generar memoria inmunológica", "Aumentan la temperatura corporal para destruir los virus"],
    respuesta: 2,
    explicacion: "Las vacunas introducen antígenos (patógenos debilitados, inactivados o fragmentos de ellos) que estimulan al sistema inmunitario a producir una respuesta y generar células de memoria, de modo que ante el patógeno real la respuesta sea rápida y eficaz."
  },
  {
    id: 173,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Cuál de las siguientes es una barrera de la inmunidad innata (no específica) del cuerpo humano?",
    opciones: ["Anticuerpos circulantes", "Linfocitos T de memoria", "La piel y las mucosas", "Vacunación"],
    respuesta: 2,
    explicacion: "La piel y las mucosas son barreras físicas de la inmunidad innata, la primera línea de defensa del organismo. La inmunidad innata es no específica y actúa contra cualquier patógeno, a diferencia de la inmunidad adquirida que es específica y genera memoria."
  },
  {
    id: 174,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Cuál de las siguientes enfermedades es causada por un virus y se transmite por la picadura del mosquito Aedes aegypti?",
    opciones: ["Tuberculosis", "Dengue", "Cólera", "Malaria"],
    respuesta: 1,
    explicacion: "El dengue es una enfermedad viral transmitida por el mosquito Aedes aegypti, prevalente en zonas tropicales como la costa ecuatoriana. La tuberculosis es bacteriana y de transmisión aérea, el cólera es bacteriano y fecal-oral, y la malaria es causada por un parásito (Plasmodium) transmitido por mosquitos Anopheles."
  },
  {
    id: 175,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "En epidemiología, ¿cómo se denomina el aumento inusual del número de casos de una enfermedad en una población y zona geográfica determinada?",
    opciones: ["Endemia", "Epidemia", "Pandemia", "Sindemia"],
    respuesta: 1,
    explicacion: "Una epidemia es el aumento inusual del número de casos de una enfermedad en un lugar y tiempo específicos, superando lo esperado. Una endemia es la presencia habitual de la enfermedad en una zona. Una pandemia es una epidemia que se extiende a múltiples países o continentes."
  },
  {
    id: 176,
    area: "naturales",
    subtema: "Sistema inmune y salud pública básica",
    pregunta: "¿Qué tipo de inmunidad adquiere un recién nacido a través de los anticuerpos presentes en la leche materna?",
    opciones: ["Inmunidad activa natural", "Inmunidad activa artificial", "Inmunidad pasiva natural", "Inmunidad pasiva artificial"],
    respuesta: 2,
    explicacion: "La leche materna transfiere anticuerpos (especialmente IgA) de la madre al bebé, brindándole inmunidad pasiva natural. Es pasiva porque el bebé no produce sus propios anticuerpos, y es natural porque no se administra artificialmente (como sería un suero)."
  },

  // ═══════════════════════════════════════════════════════════════
  // QUÍMICA GENERAL: TABLA PERIÓDICA Y SOLUCIONES (177-184)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 177,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "¿Cómo se calcula el número de neutrones de un átomo?",
    opciones: ["Número atómico + número de electrones", "Número másico menos número atómico", "Número atómico multiplicado por 2", "Número de protones + número de electrones"],
    respuesta: 1,
    explicacion: "El número de neutrones se obtiene restando el número atómico (Z, cantidad de protones) del número másico (A, suma de protones y neutrones): Neutrones = A − Z. Por ejemplo, el carbono-12 tiene A=12, Z=6, por lo tanto tiene 6 neutrones."
  },
  {
    id: 178,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "¿Qué tipo de mezcla es el agua salada (sal disuelta en agua)?",
    opciones: ["Mezcla heterogénea", "Mezcla homogénea", "Compuesto puro", "Elemento químico"],
    respuesta: 1,
    explicacion: "El agua salada es una mezcla homogénea (solución) porque la sal (NaCl) se disuelve completamente en el agua y no se pueden distinguir sus componentes a simple vista. El soluto es la sal y el solvente es el agua."
  },
  {
    id: 179,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "En la tabla periódica, ¿cómo se llama el grupo de elementos que tienen 7 electrones en su última capa de valencia y alta electronegatividad?",
    opciones: ["Metales alcalinos", "Gases nobles", "Halógenos", "Metales de transición"],
    respuesta: 2,
    explicacion: "Los halógenos (grupo 17 o VIIA) tienen 7 electrones de valencia y son muy electronegativos, por lo que tienden a ganar un electrón para completar su octeto. Incluyen flúor, cloro, bromo, yodo y astato."
  },
  {
    id: 180,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "¿Qué tipo de enlace químico se forma cuando dos átomos comparten pares de electrones?",
    opciones: ["Enlace iónico", "Enlace covalente", "Enlace metálico", "Enlace por puente de hidrógeno"],
    respuesta: 1,
    explicacion: "El enlace covalente se forma cuando dos átomos (generalmente no metálicos) comparten uno o más pares de electrones para completar su octeto. El enlace iónico implica la transferencia de electrones, y el metálico ocurre entre átomos metálicos."
  },
  {
    id: 181,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "Una solución con pH = 2 se considera:",
    opciones: ["Fuertemente básica", "Neutra", "Fuertemente ácida", "Ligeramente básica"],
    respuesta: 2,
    explicacion: "La escala de pH va de 0 a 14. Un pH menor a 7 indica acidez; mientras más bajo, más ácido. Un pH de 2 corresponde a una solución fuertemente ácida, como el jugo gástrico. Un pH de 7 es neutro y mayor a 7 es básico (alcalino)."
  },
  {
    id: 182,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "¿Qué partícula subatómica tiene carga eléctrica negativa y se encuentra en orbitales alrededor del núcleo del átomo?",
    opciones: ["Protón", "Neutrón", "Electrón", "Fotón"],
    respuesta: 2,
    explicacion: "El electrón es la partícula subatómica con carga negativa que se encuentra en los orbitales alrededor del núcleo atómico. El protón tiene carga positiva y el neutrón no tiene carga; ambos se ubican en el núcleo."
  },
  {
    id: 183,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "Si se disuelven 10 gramos de azúcar en 90 gramos de agua, ¿cuál es el porcentaje en masa del soluto en la solución?",
    opciones: ["5%", "10%", "15%", "20%"],
    respuesta: 1,
    explicacion: "El porcentaje en masa se calcula: (masa del soluto / masa de la solución) × 100. La masa total de la solución es 10 g + 90 g = 100 g. Entonces: (10/100) × 100 = 10%. El soluto es el azúcar y el solvente es el agua."
  },
  {
    id: 184,
    area: "naturales",
    subtema: "Química general: tabla periódica y soluciones",
    pregunta: "¿Qué tipo de enlace químico se forma entre el sodio (Na) y el cloro (Cl) en la sal de mesa (NaCl)?",
    opciones: ["Enlace covalente polar", "Enlace covalente no polar", "Enlace iónico", "Enlace metálico"],
    respuesta: 2,
    explicacion: "El NaCl se forma mediante un enlace iónico: el sodio (metal alcalino) cede un electrón al cloro (halógeno), formando el catión Na⁺ y el anión Cl⁻ que se atraen por fuerzas electrostáticas. Este tipo de enlace ocurre entre metales y no metales con gran diferencia de electronegatividad."
  },

  // ═══════════════════════════════════════════════════════════════
  // QUÍMICA ORGÁNICA BÁSICA Y REACCIONES COTIDIANAS (185-192)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 185,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Cuál es el principal órgano del cuerpo humano encargado de metabolizar (descomponer) el etanol contenido en las bebidas alcohólicas?",
    opciones: ["Riñón", "Estómago", "Hígado", "Pulmón"],
    respuesta: 2,
    explicacion: "El hígado es el órgano principal que metaboliza el etanol mediante la enzima alcohol deshidrogenasa, que lo convierte en acetaldehído y luego en acetato. El consumo excesivo de alcohol puede causar cirrosis hepática y otras enfermedades hepáticas."
  },
  {
    id: 186,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Qué gas tóxico se produce cuando ocurre una combustión incompleta de materiales orgánicos?",
    opciones: ["Dióxido de carbono (CO₂)", "Monóxido de carbono (CO)", "Oxígeno (O₂)", "Nitrógeno (N₂)"],
    respuesta: 1,
    explicacion: "La combustión incompleta (con insuficiente oxígeno) de combustibles orgánicos produce monóxido de carbono (CO), un gas incoloro e inodoro altamente tóxico que se une a la hemoglobina impidiendo el transporte de oxígeno en la sangre."
  },
  {
    id: 187,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Cuál es la fórmula general de los alcanos (hidrocarburos saturados)?",
    opciones: ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"],
    respuesta: 1,
    explicacion: "Los alcanos son hidrocarburos saturados (solo enlaces simples C-C) con fórmula general CₙH₂ₙ₊₂. Por ejemplo, el metano es CH₄ (n=1) y el etano es C₂H₆ (n=2). Los alquenos (CₙH₂ₙ) tienen dobles enlaces y los alquinos (CₙH₂ₙ₋₂) tienen triples enlaces."
  },
  {
    id: 188,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Qué grupo funcional caracteriza a los alcoholes en química orgánica?",
    opciones: ["Grupo carboxilo (−COOH)", "Grupo hidroxilo (−OH)", "Grupo amino (−NH₂)", "Grupo carbonilo (−C=O)"],
    respuesta: 1,
    explicacion: "Los alcoholes se caracterizan por tener un grupo hidroxilo (−OH) unido a un carbono saturado. Ejemplos comunes son el etanol (CH₃CH₂OH), presente en bebidas alcohólicas, y el metanol (CH₃OH), que es tóxico para el consumo humano."
  },
  {
    id: 189,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Cuál de las siguientes biomoléculas está compuesta por monosacáridos y constituye la principal fuente de energía inmediata para el cuerpo?",
    opciones: ["Lípidos", "Proteínas", "Carbohidratos", "Ácidos nucleicos"],
    respuesta: 2,
    explicacion: "Los carbohidratos (glúcidos o azúcares) están formados por monosacáridos como la glucosa. Son la fuente de energía más rápida para el organismo. La glucosa se metaboliza durante la respiración celular para producir ATP."
  },
  {
    id: 190,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Qué tipo de biomoléculas orgánicas incluyen las grasas, los aceites y el colesterol, y son insolubles en agua?",
    opciones: ["Carbohidratos", "Proteínas", "Lípidos", "Ácidos nucleicos"],
    respuesta: 2,
    explicacion: "Los lípidos son biomoléculas orgánicas insolubles en agua (hidrofóbicas) pero solubles en solventes orgánicos. Incluyen grasas, aceites, fosfolípidos y esteroides (como el colesterol). Cumplen funciones de reserva energética, estructural y hormonal."
  },
  {
    id: 191,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Cuáles son las unidades básicas (monómeros) que forman las proteínas?",
    opciones: ["Nucleótidos", "Aminoácidos", "Monosacáridos", "Ácidos grasos"],
    respuesta: 1,
    explicacion: "Las proteínas están formadas por cadenas de aminoácidos unidos por enlaces peptídicos. Existen 20 aminoácidos estándar, y la secuencia específica de aminoácidos determina la estructura y función de cada proteína."
  },
  {
    id: 192,
    area: "naturales",
    subtema: "Química orgánica básica y reacciones cotidianas",
    pregunta: "¿Qué proceso bioquímico realizan las levaduras para convertir glucosa en etanol y dióxido de carbono, utilizado en la elaboración de pan y vino?",
    opciones: ["Fotosíntesis", "Respiración aeróbica", "Fermentación alcohólica", "Oxidación beta"],
    respuesta: 2,
    explicacion: "La fermentación alcohólica es un proceso anaeróbico (sin oxígeno) realizado por levaduras que transforma la glucosa en etanol y CO₂. Se usa en la producción de pan (el CO₂ hace crecer la masa), vino, cerveza y otras bebidas fermentadas."
  },

  // ═══════════════════════════════════════════════════════════════
  // MEDIO AMBIENTE Y SALUD PÚBLICA (193-200)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 193,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Cómo se denomina el proceso por el cual sustancias tóxicas como el mercurio se acumulan en concentraciones crecientes a lo largo de la cadena alimentaria?",
    opciones: ["Eutrofización", "Bioacumulación", "Desertificación", "Lixiviación"],
    respuesta: 1,
    explicacion: "La bioacumulación es el proceso por el cual sustancias tóxicas como el mercurio se acumulan en los tejidos de los organismos y aumentan su concentración en cada nivel trófico (biomagnificación). Los peces depredadores grandes presentan las concentraciones más altas."
  },
  {
    id: 194,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Qué organismos formados por la simbiosis entre un hongo y un alga son utilizados como bioindicadores de la calidad del aire?",
    opciones: ["Helechos", "Musgos", "Líquenes", "Hongos micorrícicos"],
    respuesta: 2,
    explicacion: "Los líquenes son organismos formados por la simbiosis entre un hongo y un alga (o cianobacteria). Son muy sensibles a la contaminación atmosférica, especialmente al dióxido de azufre (SO₂), por lo que su presencia o ausencia indica la calidad del aire."
  },
  {
    id: 195,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Cuál es el principal gas de efecto invernadero producido por la quema de combustibles fósiles que contribuye al cambio climático?",
    opciones: ["Oxígeno (O₂)", "Nitrógeno (N₂)", "Dióxido de carbono (CO₂)", "Argón (Ar)"],
    respuesta: 2,
    explicacion: "El dióxido de carbono (CO₂) es el principal gas de efecto invernadero generado por actividades humanas, principalmente la quema de combustibles fósiles (petróleo, gas natural y carbón). Atrapa calor en la atmósfera, contribuyendo al calentamiento global."
  },
  {
    id: 196,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Cuál de las siguientes opciones corresponde al principio de las '3R' de la gestión ambiental de residuos?",
    opciones: ["Reforestar, reciclar, reubicar", "Reducir, reutilizar, reciclar", "Recuperar, reemplazar, reparar", "Redistribuir, reciclar, reponer"],
    respuesta: 1,
    explicacion: "Las 3R de la gestión de residuos son: Reducir (disminuir el consumo), Reutilizar (dar nuevo uso a los objetos) y Reciclar (transformar residuos en nuevos materiales). Este principio busca minimizar la generación de basura y el impacto ambiental."
  },
  {
    id: 197,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Qué fenómeno ocurre cuando un cuerpo de agua recibe exceso de nutrientes (nitrógeno y fósforo), provocando el crecimiento descontrolado de algas?",
    opciones: ["Bioacumulación", "Eutrofización", "Desertificación", "Erosión hídrica"],
    respuesta: 1,
    explicacion: "La eutrofización es el enriquecimiento excesivo de nutrientes en cuerpos de agua, generalmente por vertidos agrícolas o domésticos. Provoca proliferación de algas que, al descomponerse, consumen el oxígeno disuelto, causando la muerte de peces y otros organismos acuáticos."
  },
  {
    id: 198,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Qué capa de la atmósfera terrestre nos protege de la radiación ultravioleta dañina del Sol?",
    opciones: ["Troposfera", "Capa de ozono (en la estratosfera)", "Mesosfera", "Termosfera"],
    respuesta: 1,
    explicacion: "La capa de ozono se encuentra en la estratosfera (entre 15 y 35 km de altitud) y absorbe la mayor parte de la radiación ultravioleta (UV) del Sol. Los clorofluorocarbonos (CFC) han causado su adelgazamiento, especialmente sobre la Antártida."
  },
  {
    id: 199,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Qué son las partículas PM2.5 y por qué representan un riesgo para la salud humana?",
    opciones: ["Gases tóxicos que causan irritación ocular", "Partículas finas menores a 2.5 micrómetros que penetran profundamente en los pulmones", "Bacterias transmitidas por el agua contaminada", "Sustancias radiactivas presentes en el suelo"],
    respuesta: 1,
    explicacion: "Las partículas PM2.5 son material particulado con diámetro menor a 2.5 micrómetros, provenientes de la combustión vehicular, industrial y quemas. Por su tamaño diminuto penetran profundamente en los pulmones e incluso al torrente sanguíneo, causando enfermedades respiratorias y cardiovasculares."
  },
  {
    id: 200,
    area: "naturales",
    subtema: "Medio ambiente y salud pública",
    pregunta: "¿Cuál de las siguientes enfermedades está relacionada directamente con la contaminación del agua?",
    opciones: ["Asma bronquial", "Cólera", "Osteoporosis", "Diabetes mellitus"],
    respuesta: 1,
    explicacion: "El cólera es una enfermedad infecciosa causada por la bacteria Vibrio cholerae, transmitida principalmente por agua contaminada con materia fecal. Causa diarrea severa y deshidratación. Es un problema de salud pública asociado a la falta de agua potable y saneamiento adecuado."
  }
];

const PREGUNTAS_DB = [...PREGUNTAS_MATEMATICAS, ...PREGUNTAS_LENGUAJE, ...PREGUNTAS_SOCIALES, ...PREGUNTAS_NATURALES];
