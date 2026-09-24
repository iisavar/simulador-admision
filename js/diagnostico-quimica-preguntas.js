const DIAGNOSTICO_PREGUNTAS = [
    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 1: Estructura atómica y configuración electrónica (Q1-Q6)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 1, tipo: 'opcion_multiple',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: 'El número atómico (Z) de un elemento indica:',
        opciones: ['El número de neutrones del núcleo', 'La suma de protones y neutrones', 'El número de protones del núcleo', 'El número de niveles de energía ocupados'],
        respuesta: 2,
        explicacion: 'Z es el número de protones del núcleo y es lo que identifica a cada elemento. La suma de protones y neutrones es el número másico (A).'
    },
    {
        id: 2, tipo: 'opcion_multiple',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: '¿Cuál es la configuración electrónica correcta del sodio (Na, Z = 11)?',
        opciones: ['1s² 2s² 2p⁷', '1s² 2s² 2p⁶ 3s¹', '1s² 2s⁶ 2p³', '1s² 2s² 2p⁶ 3p¹'],
        respuesta: 1,
        explicacion: 'Se llenan los subniveles en orden 1s, 2s, 2p, 3s: 2 + 2 + 6 + 1 = 11 electrones. Un subnivel s admite máximo 2 electrones y un p máximo 6, y el 3s se llena antes que el 3p.'
    },
    {
        id: 3, tipo: 'opcion_multiple',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: 'El calcio (Z = 20) forma el ion Ca²⁺, importante en huesos y contracción muscular. ¿Cuántos electrones tiene el ion Ca²⁺?',
        opciones: ['22', '20', '40', '18'],
        respuesta: 3,
        explicacion: 'El átomo neutro de calcio tiene 20 electrones. La carga 2+ indica que perdió 2 electrones: 20 − 2 = 18. Los protones no cambian.'
    },
    {
        id: 4, tipo: 'seleccion_multiple',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: 'El carbono-12 (¹²C) y el carbono-14 (¹⁴C) son isótopos del carbono (Z = 6). ¿Cuáles afirmaciones son correctas? (Selecciona todas las correctas)',
        opciones: ['Tienen distinto número atómico', 'Ambos tienen 6 protones', 'El ¹⁴C tiene 8 protones', 'El ¹⁴C tiene 8 neutrones'],
        respuestas: [1, 3],
        explicacion: 'Los isótopos tienen el mismo número de protones (mismo Z = 6) pero distinto número de neutrones. En el ¹⁴C: neutrones = A − Z = 14 − 6 = 8.'
    },
    {
        id: 5, tipo: 'emparejamiento',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: 'Empareja cada término con su descripción:',
        columna_a: ['Protón', 'Neutrón', 'Electrón', 'Número másico (A)'],
        columna_b: ['Partícula sin carga eléctrica del núcleo', 'Suma de protones y neutrones', 'Partícula con carga positiva del núcleo', 'Partícula con carga negativa que se ubica en orbitales'],
        pares: [2, 0, 3, 1],
        explicacion: 'El protón (+) y el neutrón (sin carga) están en el núcleo; el electrón (−) está en la nube electrónica, en orbitales. El número másico A = protones + neutrones.'
    },
    {
        id: 6, tipo: 'completar_numero',
        subtema: 'Estructura atómica y configuración electrónica',
        pregunta: 'El hierro, presente en la hemoglobina, tiene número atómico Z = 26 y número másico A = 56. ¿Cuántos neutrones tiene su núcleo? Escribe solo el número.',
        respuesta: 30,
        explicacion: 'Neutrones = A − Z = 56 − 26 = 30.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 2: Tabla periódica y propiedades periódicas (Q7-Q12)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 7, tipo: 'opcion_multiple',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: 'En la tabla periódica actual, los elementos están ordenados según su:',
        opciones: ['Número de neutrones creciente', 'Masa atómica creciente', 'Densidad creciente', 'Número atómico creciente'],
        respuesta: 3,
        explicacion: 'La tabla periódica moderna (ley periódica de Moseley) ordena los elementos por número atómico (Z) creciente. Mendeléiev usó la masa atómica, pero ese criterio fue reemplazado.'
    },
    {
        id: 8, tipo: 'opcion_multiple',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: 'El azufre (Z = 16) tiene la configuración 1s² 2s² 2p⁶ 3s² 3p⁴. ¿Dónde se ubica en la tabla periódica?',
        opciones: ['Periodo 3, grupo 16 (VIA)', 'Periodo 4, grupo 16 (VIA)', 'Periodo 3, grupo 14 (IVA)', 'Periodo 2, grupo 16 (VIA)'],
        respuesta: 0,
        explicacion: 'El nivel más alto ocupado es n = 3, así que está en el periodo 3. Tiene 6 electrones de valencia (3s² 3p⁴), por eso pertenece al grupo 16 (VIA).'
    },
    {
        id: 9, tipo: 'opcion_multiple',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: '¿Cuál de los siguientes elementos es el más electronegativo?',
        opciones: ['Sodio (Na)', 'Carbono (C)', 'Flúor (F)', 'Hierro (Fe)'],
        respuesta: 2,
        explicacion: 'La electronegatividad aumenta hacia la derecha y hacia arriba en la tabla periódica. El flúor es el elemento más electronegativo de toda la tabla.'
    },
    {
        id: 10, tipo: 'opcion_multiple',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: 'Al avanzar de izquierda a derecha en el periodo 3 (del sodio al cloro), el radio atómico:',
        opciones: ['Aumenta, porque hay más electrones', 'Disminuye, porque aumenta la carga nuclear que atrae a los electrones', 'No cambia, porque todos tienen 3 niveles', 'Aumenta y luego disminuye'],
        respuesta: 1,
        explicacion: 'En un mismo periodo los electrones se añaden al mismo nivel, pero el núcleo tiene cada vez más protones y los atrae con más fuerza. Por eso el radio atómico disminuye de izquierda a derecha.'
    },
    {
        id: 11, tipo: 'seleccion_multiple',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: '¿Cuáles de los siguientes elementos son metales alcalinos (grupo 1)? (Selecciona todas las correctas)',
        opciones: ['Litio (Li)', 'Calcio (Ca)', 'Sodio (Na)', 'Potasio (K)'],
        respuestas: [0, 2, 3],
        explicacion: 'Li, Na y K están en el grupo 1 (metales alcalinos, 1 electrón de valencia). El calcio está en el grupo 2 (alcalinotérreos). Na⁺ y K⁺ son electrolitos esenciales del cuerpo.'
    },
    {
        id: 12, tipo: 'emparejamiento',
        subtema: 'Tabla periódica y propiedades periódicas',
        pregunta: 'Empareja cada grupo de la tabla periódica con su nombre:',
        columna_a: ['Grupo 1', 'Grupo 2', 'Grupo 17', 'Grupo 18'],
        columna_b: ['Gases nobles', 'Halógenos', 'Metales alcalinos', 'Metales alcalinotérreos'],
        pares: [2, 3, 1, 0],
        explicacion: 'Grupo 1: metales alcalinos (Na, K). Grupo 2: alcalinotérreos (Mg, Ca). Grupo 17: halógenos (F, Cl, I). Grupo 18: gases nobles (He, Ne, Ar), con su capa externa completa.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 3: Enlaces químicos (Q13-Q18)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 13, tipo: 'opcion_multiple',
        subtema: 'Enlaces químicos',
        pregunta: 'El cloruro de sodio (NaCl), la sal de mesa, se forma mediante un enlace:',
        opciones: ['Iónico', 'Covalente apolar', 'Metálico', 'Covalente polar'],
        respuesta: 0,
        explicacion: 'El sodio (metal) cede un electrón al cloro (no metal), formando los iones Na⁺ y Cl⁻, que se atraen por fuerzas electrostáticas: eso es un enlace iónico.'
    },
    {
        id: 14, tipo: 'opcion_multiple',
        subtema: 'Enlaces químicos',
        pregunta: 'En la molécula de oxígeno (O₂) que respiramos, los dos átomos están unidos por:',
        opciones: ['Un enlace iónico', 'Un enlace covalente simple', 'Un enlace covalente doble', 'Un enlace covalente triple'],
        respuesta: 2,
        explicacion: 'Cada oxígeno tiene 6 electrones de valencia y necesita 2 más para completar el octeto, así que comparten 2 pares de electrones: O=O, un enlace covalente doble.'
    },
    {
        id: 15, tipo: 'opcion_multiple',
        subtema: 'Enlaces químicos',
        pregunta: '¿Cuál de estas sustancias presenta enlaces covalentes polares?',
        opciones: ['Cl₂', 'NaCl', 'N₂', 'H₂O'],
        respuesta: 3,
        explicacion: 'En el H₂O el oxígeno es más electronegativo que el hidrógeno, por lo que comparte los electrones de forma desigual (enlace covalente polar). Cl₂ y N₂ son covalentes apolares (átomos iguales) y NaCl es iónico.'
    },
    {
        id: 16, tipo: 'opcion_multiple',
        subtema: 'Enlaces químicos',
        pregunta: 'Considera que un enlace es iónico cuando la diferencia de electronegatividad (ΔEN) es mayor que 1,7. Si EN(K) = 0,8 y EN(Cl) = 3,0, ¿qué tipo de enlace hay en el KCl?',
        opciones: ['Covalente apolar, con ΔEN = 0', 'Iónico, con ΔEN = 2,2', 'Covalente polar, con ΔEN = 1,2', 'Iónico, con ΔEN = 3,8'],
        respuesta: 1,
        explicacion: 'ΔEN = 3,0 − 0,8 = 2,2. Como 2,2 es mayor que 1,7, el enlace es iónico. La diferencia se calcula restando, no sumando (3,0 + 0,8 = 3,8 es un error).'
    },
    {
        id: 17, tipo: 'seleccion_multiple',
        subtema: 'Enlaces químicos',
        pregunta: '¿Cuáles son propiedades típicas de los compuestos iónicos como el NaCl? (Selecciona todas las correctas)',
        opciones: ['Son gases a temperatura ambiente', 'Tienen puntos de fusión altos', 'Conducen la electricidad cuando están disueltos en agua o fundidos', 'Conducen la electricidad en estado sólido'],
        respuestas: [1, 2],
        explicacion: 'Los compuestos iónicos forman redes cristalinas sólidas con puntos de fusión altos. En estado sólido los iones están fijos y no conducen; disueltos o fundidos, los iones se mueven y sí conducen la electricidad.'
    },
    {
        id: 18, tipo: 'emparejamiento',
        subtema: 'Enlaces químicos',
        pregunta: 'Empareja cada sustancia con el tipo de enlace o interacción que la caracteriza:',
        columna_a: ['NaCl (sal de mesa)', 'Cobre (Cu) de un cable', 'CH₄ (metano)', 'Atracción entre moléculas de agua'],
        columna_b: ['Covalente', 'Puente de hidrógeno', 'Iónico', 'Metálico'],
        pares: [2, 3, 0, 1],
        explicacion: 'NaCl: iónico (metal + no metal). Cu: metálico (red de cationes con electrones libres). CH₄: covalente (no metales que comparten electrones). Entre moléculas de agua actúan puentes de hidrógeno.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 4: Química inorgánica: nomenclatura y funciones (Q19-Q24)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 19, tipo: 'opcion_multiple',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: 'El Fe₂O₃ es el principal componente de la herrumbre. ¿Cuál es su nombre en nomenclatura Stock?',
        opciones: ['Óxido de hierro (II)', 'Óxido de hierro (III)', 'Óxido ferroso', 'Hidróxido de hierro (III)'],
        respuesta: 1,
        explicacion: 'El oxígeno actúa con −2: 3 × (−2) = −6, que se reparte entre 2 átomos de hierro, así que cada Fe tiene +3. En Stock: óxido de hierro (III); en tradicional: óxido férrico (ferroso corresponde a +2).'
    },
    {
        id: 20, tipo: 'opcion_multiple',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: 'Un hidróxido (base), como el Mg(OH)₂, se obtiene cuando reacciona:',
        opciones: ['Un óxido ácido (no metal + oxígeno) con agua', 'Un ácido con una base', 'Un óxido básico (metal + oxígeno) con agua', 'Un no metal con hidrógeno'],
        respuesta: 2,
        explicacion: 'Óxido básico + agua → hidróxido (por ejemplo, MgO + H₂O → Mg(OH)₂). Un óxido ácido con agua forma un ácido oxácido, y un ácido con una base forma sal y agua.'
    },
    {
        id: 21, tipo: 'opcion_multiple',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: 'El jugo gástrico del estómago contiene HCl disuelto en agua. ¿Cuál es el nombre de este ácido?',
        opciones: ['Ácido clórico', 'Ácido hipocloroso', 'Ácido cloroso', 'Ácido clorhídrico'],
        respuesta: 3,
        explicacion: 'El HCl es un ácido hidrácido (no tiene oxígeno); en solución acuosa se nombra con la terminación -hídrico: ácido clorhídrico. Clórico, cloroso e hipocloroso son oxácidos (contienen oxígeno).'
    },
    {
        id: 22, tipo: 'seleccion_multiple',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: '¿Cuáles de los siguientes compuestos son sales? (Selecciona todas las correctas)',
        opciones: ['NaOH', 'NaCl', 'H₂SO₄', 'CaCO₃'],
        respuestas: [1, 3],
        explicacion: 'Las sales se forman por la unión de un catión (generalmente un metal) con el anión de un ácido: NaCl (cloruro de sodio) y CaCO₃ (carbonato de calcio). NaOH es un hidróxido y H₂SO₄ es un ácido oxácido.'
    },
    {
        id: 23, tipo: 'emparejamiento',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: 'Empareja cada fórmula con su función química:',
        columna_a: ['CaO', 'Mg(OH)₂', 'H₂SO₄', 'KNO₃'],
        columna_b: ['Sal oxisal', 'Óxido básico', 'Ácido oxácido', 'Hidróxido'],
        pares: [1, 3, 2, 0],
        explicacion: 'CaO: metal + oxígeno (óxido básico). Mg(OH)₂: grupo OH⁻ (hidróxido; es la leche de magnesia). H₂SO₄: H + no metal + O (ácido oxácido). KNO₃: metal + anión con oxígeno (sal oxisal).'
    },
    {
        id: 24, tipo: 'completar_numero',
        subtema: 'Química inorgánica: nomenclatura y funciones',
        pregunta: '¿Cuál es el número de oxidación del azufre (S) en el ácido sulfúrico, H₂SO₄? Considera H = +1 y O = −2. Escribe solo el número (sin signo si es positivo).',
        respuesta: 6,
        explicacion: 'La suma de números de oxidación en un compuesto neutro es 0: 2(+1) + x + 4(−2) = 0 → 2 + x − 8 = 0 → x = +6.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 5: Reacciones químicas y balanceo (Q25-Q30)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 25, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: 'La ley de conservación de la masa (Lavoisier) establece que, en una reacción química:',
        opciones: ['La masa total de los reactivos es igual a la masa total de los productos', 'La masa de los productos siempre es mayor que la de los reactivos', 'Los átomos de un elemento se transforman en átomos de otro elemento', 'El número total de moléculas siempre se conserva'],
        respuesta: 0,
        explicacion: 'En una reacción los átomos solo se reorganizan: no se crean ni se destruyen. Por eso la masa total se conserva, aunque el número de moléculas sí puede cambiar.'
    },
    {
        id: 26, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: '¿Cuántos moles hay en 36 g de agua (H₂O)? Masa molar del H₂O = 18 g/mol.',
        opciones: ['0,5 mol', '2 mol', '18 mol', '648 mol'],
        respuesta: 1,
        explicacion: 'moles = masa ÷ masa molar = 36 g ÷ 18 g/mol = 2 mol. Multiplicar (36 × 18 = 648) o invertir la división (18 ÷ 36 = 0,5) son errores comunes.'
    },
    {
        id: 27, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: '¿Cuál de las siguientes ecuaciones para la formación del amoníaco (NH₃) está correctamente balanceada?',
        opciones: ['N₂ + 3 H₂ → 2 NH₃', 'N₂ + H₂ → 2 NH₃', 'N₂ + 3 H₂ → NH₃', '2 N₂ + 3 H₂ → 2 NH₃'],
        respuesta: 0,
        explicacion: 'En N₂ + 3 H₂ → 2 NH₃ hay 2 átomos de N y 6 de H a cada lado. En las demás opciones no coincide el número de átomos de N o de H entre reactivos y productos.'
    },
    {
        id: 28, tipo: 'emparejamiento',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: 'Empareja cada reacción con su tipo:',
        columna_a: ['2 Mg + O₂ → 2 MgO', 'CaCO₃ → CaO + CO₂', 'Zn + 2 HCl → ZnCl₂ + H₂', 'AgNO₃ + NaCl → AgCl + NaNO₃'],
        columna_b: ['Descomposición', 'Doble desplazamiento', 'Síntesis (combinación)', 'Desplazamiento simple'],
        pares: [2, 0, 3, 1],
        explicacion: 'Síntesis: dos sustancias forman una (A + B → AB). Descomposición: una se separa en varias (AB → A + B). Desplazamiento simple: el Zn reemplaza al H (A + BC → AC + B). Doble desplazamiento: se intercambian los iones (AB + CD → AD + CB).'
    },
    {
        id: 29, tipo: 'completar_numero',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: 'El propano (C₃H₈) es un componente del gas de uso doméstico. Balancea su combustión: C₃H₈ + __ O₂ → 3 CO₂ + 4 H₂O. ¿Qué coeficiente va delante del O₂? Escribe solo el número.',
        respuesta: 5,
        explicacion: 'En los productos hay 3 × 2 + 4 × 1 = 10 átomos de oxígeno. Para tener 10 átomos de O en los reactivos se necesitan 5 moléculas de O₂ (5 × 2 = 10).'
    },
    {
        id: 30, tipo: 'completar_numero',
        subtema: 'Reacciones químicas y balanceo',
        pregunta: 'Calcula la masa molar de la glucosa, C₆H₁₂O₆. Masas atómicas: C = 12, H = 1, O = 16 (g/mol). Escribe solo el número (en g/mol).',
        respuesta: 180,
        explicacion: 'Masa molar = 6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180 g/mol.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 6: Reacciones químicas en la vida diaria (Q31-Q36)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 31, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: 'Una persona con acidez estomacal (exceso de HCl) toma un antiácido de hidróxido de magnesio, Mg(OH)₂. ¿Qué tipo de reacción ocurre en su estómago?',
        opciones: ['Combustión', 'Fermentación', 'Neutralización', 'Corrosión'],
        respuesta: 2,
        explicacion: 'Un ácido reacciona con una base y forma sal y agua: Mg(OH)₂ + 2 HCl → MgCl₂ + 2 H₂O. Esta reacción de neutralización reduce la acidez.'
    },
    {
        id: 32, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: 'Para que un clavo de hierro se oxide y forme herrumbre (corrosión), es necesaria la presencia de:',
        opciones: ['Nitrógeno del aire', 'Luz solar únicamente', 'Dióxido de carbono únicamente', 'Oxígeno y agua (humedad)'],
        respuesta: 3,
        explicacion: 'La corrosión del hierro es una reacción de oxidación que necesita oxígeno y agua. Por eso los objetos de hierro se oxidan más rápido en ambientes húmedos, como las zonas costeras.'
    },
    {
        id: 33, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: 'En la elaboración del pan y de la chicha, las levaduras transforman los azúcares en etanol y CO₂ en ausencia de oxígeno. Este proceso se llama:',
        opciones: ['Fermentación alcohólica', 'Fotosíntesis', 'Combustión', 'Neutralización'],
        respuesta: 0,
        explicacion: 'La fermentación alcohólica es: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂. El CO₂ hace que la masa del pan se infle, y el etanol se evapora durante el horneado.'
    },
    {
        id: 34, tipo: 'opcion_multiple',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: '¿Cómo se relacionan la fotosíntesis y la respiración celular?',
        opciones: ['La respiración produce glucosa y O₂ a partir de CO₂ y agua', 'Los productos de la fotosíntesis (glucosa y O₂) son los reactivos de la respiración celular', 'La fotosíntesis libera energía y la respiración la almacena', 'Ambas consumen CO₂ y liberan O₂'],
        respuesta: 1,
        explicacion: 'Fotosíntesis: 6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂ (almacena energía). Respiración: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energía. Son procesos inversos.'
    },
    {
        id: 35, tipo: 'seleccion_multiple',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: '¿Cuáles de los siguientes procesos cotidianos son cambios químicos (reacciones químicas)? (Selecciona todas las correctas)',
        opciones: ['Cocinar un huevo', 'Derretir hielo', 'Quemar gas en la cocina', 'La oxidación de un clavo a la intemperie'],
        respuestas: [0, 2, 3],
        explicacion: 'En un cambio químico se forman sustancias nuevas: al cocinar el huevo sus proteínas se desnaturalizan, al quemar gas se forman CO₂ y H₂O, y el clavo forma óxido de hierro. Derretir hielo es un cambio físico (solo cambia de estado).'
    },
    {
        id: 36, tipo: 'emparejamiento',
        subtema: 'Reacciones químicas en la vida diaria',
        pregunta: 'Empareja cada situación cotidiana con el proceso químico que ocurre:',
        columna_a: ['Una pila que enciende una linterna', 'Una manzana cortada que se oscurece', 'Quemar leña en una fogata', 'Tomar bicarbonato de sodio para la acidez'],
        columna_b: ['Combustión', 'Oxidación (pardeamiento por enzimas y oxígeno del aire)', 'Neutralización ácido–base', 'Transformación de energía química en eléctrica'],
        pares: [3, 1, 0, 2],
        explicacion: 'La pila usa una reacción redox para producir corriente eléctrica. La manzana se oscurece porque sus compuestos se oxidan con el oxígeno del aire. La leña arde (combustión) y el bicarbonato (base) neutraliza el ácido del estómago.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 7: Soluciones, concentración y pH (Q37-Q42)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 37, tipo: 'opcion_multiple',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'En el suero fisiológico (solución de cloruro de sodio en agua), el soluto y el solvente son, respectivamente:',
        opciones: ['Agua y cloruro de sodio', 'Suero y agua', 'Cloruro de sodio y suero', 'Cloruro de sodio y agua'],
        respuesta: 3,
        explicacion: 'El soluto es la sustancia que se disuelve y está en menor cantidad (NaCl); el solvente es la que disuelve y está en mayor cantidad (agua). El suero es la solución completa.'
    },
    {
        id: 38, tipo: 'opcion_multiple',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'El jugo gástrico tiene un pH aproximado de 2 y la sangre, de 7,4. ¿Cuál afirmación es correcta?',
        opciones: ['El jugo gástrico es ácido y la sangre es ligeramente básica', 'Ambos son ácidos', 'El jugo gástrico es básico y la sangre es neutra', 'La sangre es más ácida que el jugo gástrico'],
        respuesta: 0,
        explicacion: 'En la escala de pH (a 25 °C): menor que 7 es ácido, 7 es neutro y mayor que 7 es básico. pH 2 es muy ácido y pH 7,4 es ligeramente básico. Cuanto menor es el pH, más ácida es la solución.'
    },
    {
        id: 39, tipo: 'opcion_multiple',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'Se toman 100 mL de una solución de glucosa al 10 % m/v y se les añade agua hasta completar 200 mL. ¿Cuál es la nueva concentración?',
        opciones: ['20 % m/v', '10 % m/v', '5 % m/v', '2,5 % m/v'],
        respuesta: 2,
        explicacion: 'Al diluir, la cantidad de soluto no cambia: C₁V₁ = C₂V₂ → 10 % × 100 mL = C₂ × 200 mL → C₂ = 5 % m/v. Si el volumen se duplica, la concentración se reduce a la mitad.'
    },
    {
        id: 40, tipo: 'seleccion_multiple',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'El suero fisiológico es una solución de NaCl al 0,9 % m/v. ¿Cuáles afirmaciones son correctas? (Selecciona todas las correctas)',
        opciones: ['Contiene 0,9 g de NaCl por cada 100 mL de solución', 'El NaCl es el solvente', 'Contiene 0,9 g de NaCl por cada litro de solución', 'Contiene 9 g de NaCl por cada litro de solución'],
        respuestas: [0, 3],
        explicacion: '% m/v = gramos de soluto por cada 100 mL de solución. 0,9 g en 100 mL equivale a 9 g en 1000 mL (1 L). El NaCl es el soluto y el agua es el solvente.'
    },
    {
        id: 41, tipo: 'completar_numero',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'Se disuelven 20 g de NaOH (masa molar = 40 g/mol) en agua hasta completar 500 mL de solución. ¿Cuál es la molaridad (mol/L) de la solución? Escribe solo el número.',
        respuesta: 1,
        explicacion: 'moles de NaOH = 20 g ÷ 40 g/mol = 0,5 mol. Volumen = 500 mL = 0,5 L. Molaridad = 0,5 mol ÷ 0,5 L = 1 mol/L (1 M).'
    },
    {
        id: 42, tipo: 'completar_numero',
        subtema: 'Soluciones, concentración y pH',
        pregunta: 'Una solución tiene una concentración de iones hidrógeno [H⁺] = 10⁻³ mol/L. Sabiendo que pH = −log[H⁺], ¿cuál es su pH? Escribe solo el número.',
        respuesta: 3,
        explicacion: 'pH = −log(10⁻³) = −(−3) = 3. Es una solución ácida porque su pH es menor que 7.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 8: Hidrocarburos (Q43-Q48)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 43, tipo: 'opcion_multiple',
        subtema: 'Hidrocarburos',
        pregunta: 'Los alcanos son hidrocarburos que se caracterizan por tener:',
        opciones: ['Al menos un doble enlace C=C', 'Al menos un triple enlace C≡C', 'Solo enlaces simples entre sus carbonos', 'Un anillo bencénico'],
        respuesta: 2,
        explicacion: 'Los alcanos (terminación -ano) son hidrocarburos saturados: solo tienen enlaces simples C–C. Los alquenos (-eno) tienen doble enlace, los alquinos (-ino) triple enlace y los aromáticos, anillo bencénico.'
    },
    {
        id: 44, tipo: 'opcion_multiple',
        subtema: 'Hidrocarburos',
        pregunta: '¿Cuál es la fórmula general de los alquenos que tienen un solo doble enlace?',
        opciones: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
        respuesta: 1,
        explicacion: 'Alcanos: CₙH₂ₙ₊₂. Cada doble enlace resta 2 hidrógenos, así que los alquenos son CₙH₂ₙ (ej.: eteno, C₂H₄). Los alquinos son CₙH₂ₙ₋₂.'
    },
    {
        id: 45, tipo: 'opcion_multiple',
        subtema: 'Hidrocarburos',
        pregunta: '¿Cuál es el nombre del compuesto CH₃–CH=CH–CH₃?',
        opciones: ['1-buteno', 'Butano', '2-butino', '2-buteno'],
        respuesta: 3,
        explicacion: 'Tiene 4 carbonos (prefijo but-) y un doble enlace (terminación -eno). Numerando la cadena, el doble enlace empieza en el carbono 2: 2-buteno (but-2-eno).'
    },
    {
        id: 46, tipo: 'seleccion_multiple',
        subtema: 'Hidrocarburos',
        pregunta: '¿Cuáles de los siguientes compuestos son hidrocarburos? (Selecciona todas las correctas)',
        opciones: ['Metano (CH₄)', 'Etanol (C₂H₅OH)', 'Benceno (C₆H₆)', 'Ácido acético (CH₃COOH)'],
        respuestas: [0, 2],
        explicacion: 'Los hidrocarburos contienen únicamente carbono e hidrógeno: el metano y el benceno. El etanol y el ácido acético contienen además oxígeno, así que son compuestos oxigenados.'
    },
    {
        id: 47, tipo: 'emparejamiento',
        subtema: 'Hidrocarburos',
        pregunta: 'Empareja cada hidrocarburo con su fórmula molecular:',
        columna_a: ['Metano', 'Eteno (etileno)', 'Etino (acetileno)', 'Propano'],
        columna_b: ['C₂H₂', 'C₃H₈', 'CH₄', 'C₂H₄'],
        pares: [2, 3, 0, 1],
        explicacion: 'Metano: alcano de 1 C (CH₄). Eteno: alqueno de 2 C (C₂H₄). Etino: alquino de 2 C (C₂H₂). Propano: alcano de 3 C (C₃H₈, según CₙH₂ₙ₊₂).'
    },
    {
        id: 48, tipo: 'completar_numero',
        subtema: 'Hidrocarburos',
        pregunta: 'El octano, componente de la gasolina, es un alcano de 8 átomos de carbono. ¿Cuántos átomos de hidrógeno tiene su molécula? Escribe solo el número.',
        respuesta: 18,
        explicacion: 'Los alcanos siguen la fórmula CₙH₂ₙ₊₂. Con n = 8: H = 2(8) + 2 = 18. El octano es C₈H₁₈.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 9: Química orgánica: grupos funcionales (Q49-Q54)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 49, tipo: 'opcion_multiple',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: '¿Por qué el carbono puede formar una enorme variedad de compuestos orgánicos?',
        opciones: ['Porque es un metal muy reactivo', 'Porque siempre forma enlaces iónicos', 'Porque tiene 6 electrones de valencia', 'Porque tiene 4 electrones de valencia y puede unirse a otros carbonos formando cadenas y anillos'],
        respuesta: 3,
        explicacion: 'El carbono tiene 4 electrones de valencia, forma 4 enlaces covalentes y puede enlazarse consigo mismo (concatenación), formando cadenas lineales, ramificadas y anillos. Tiene Z = 6, pero solo 4 electrones de valencia.'
    },
    {
        id: 50, tipo: 'opcion_multiple',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: 'El etanol (CH₃–CH₂–OH), usado como antiséptico al 70 %, pertenece al grupo funcional de los:',
        opciones: ['Aldehídos', 'Ácidos carboxílicos', 'Alcoholes', 'Éteres'],
        respuesta: 2,
        explicacion: 'El grupo hidroxilo (–OH) unido a un carbono saturado caracteriza a los alcoholes, cuyo nombre termina en -ol.'
    },
    {
        id: 51, tipo: 'opcion_multiple',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: 'El formaldehído (H–CHO), cuya solución acuosa llamada formol se usa para conservar muestras biológicas, pertenece al grupo de los:',
        opciones: ['Cetonas', 'Aldehídos', 'Alcoholes', 'Amidas'],
        respuesta: 1,
        explicacion: 'El grupo –CHO (carbonilo en el extremo de la cadena) caracteriza a los aldehídos, que terminan en -al (metanal). En las cetonas el carbonilo está en un carbono intermedio (R–CO–R′).'
    },
    {
        id: 52, tipo: 'opcion_multiple',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: 'En el metano (CH₄) el carbono forma 4 enlaces simples dirigidos hacia los vértices de un tetraedro. ¿Qué hibridación tiene ese carbono?',
        opciones: ['sp³', 'sp²', 'sp', 'No tiene hibridación'],
        respuesta: 0,
        explicacion: 'Un carbono con 4 enlaces simples tiene hibridación sp³ y geometría tetraédrica (ángulos de 109,5°). Con un doble enlace es sp² y con un triple enlace es sp.'
    },
    {
        id: 53, tipo: 'seleccion_multiple',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: '¿Cuáles de las siguientes sustancias contienen el grupo carboxilo (–COOH), propio de los ácidos carboxílicos? (Selecciona todas las correctas)',
        opciones: ['Etanol (alcohol antiséptico)', 'Ácido acético (del vinagre)', 'Ácido acetilsalicílico (aspirina)', 'Acetona (quitaesmalte)'],
        respuestas: [1, 2],
        explicacion: 'El ácido acético (CH₃COOH) y la aspirina tienen el grupo –COOH. El etanol es un alcohol (–OH) y la acetona es una cetona (C=O entre dos carbonos).'
    },
    {
        id: 54, tipo: 'emparejamiento',
        subtema: 'Química orgánica: grupos funcionales',
        pregunta: 'Empareja cada fórmula general con su grupo funcional:',
        columna_a: ['R–OH', 'R–COOH', 'R–NH₂', 'R–COO–R′'],
        columna_b: ['Éster', 'Alcohol', 'Amina', 'Ácido carboxílico'],
        pares: [1, 3, 2, 0],
        explicacion: 'R–OH: alcohol. R–COOH: ácido carboxílico. R–NH₂: amina (derivada del amoníaco). R–COO–R′: éster, responsable del aroma de muchas frutas.'
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBTEMA 10: Composición química de los seres vivos (Q55-Q60)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 55, tipo: 'opcion_multiple',
        subtema: 'Composición química de los seres vivos',
        pregunta: '¿Cuáles son los bioelementos primarios, que forman la mayor parte de la materia viva?',
        opciones: ['C, H, O, N, P y S', 'Na, K, Cl y Mg', 'Fe, Cu, Zn e I', 'Ca, Fe, Na y K'],
        respuesta: 0,
        explicacion: 'Carbono, hidrógeno, oxígeno, nitrógeno, fósforo y azufre forman las biomoléculas (carbohidratos, lípidos, proteínas y ácidos nucleicos). Na, K, Cl, Mg y Ca son secundarios, y Fe, Cu, Zn e I son oligoelementos.'
    },
    {
        id: 56, tipo: 'opcion_multiple',
        subtema: 'Composición química de los seres vivos',
        pregunta: 'La glucosa (C₆H₁₂O₆), principal fuente de energía de las células, es un:',
        opciones: ['Disacárido', 'Polisacárido', 'Monosacárido', 'Lípido'],
        respuesta: 2,
        explicacion: 'La glucosa es un monosacárido (azúcar simple) de 6 carbonos: no puede dividirse en azúcares más pequeños. La sacarosa es un disacárido y el almidón y el glucógeno son polisacáridos.'
    },
    {
        id: 57, tipo: 'opcion_multiple',
        subtema: 'Composición química de los seres vivos',
        pregunta: 'Las enzimas son biomoléculas que:',
        opciones: ['Actúan como catalizadores biológicos: aceleran las reacciones sin consumirse', 'Almacenan la información genética', 'Son la principal reserva de energía a largo plazo', 'Se consumen por completo en la reacción que aceleran'],
        respuesta: 0,
        explicacion: 'Las enzimas (en su gran mayoría proteínas) disminuyen la energía de activación y aceleran reacciones específicas; al final quedan intactas y pueden volver a actuar. La información genética está en los ácidos nucleicos y la reserva de energía, en los lípidos.'
    },
    {
        id: 58, tipo: 'opcion_multiple',
        subtema: 'Composición química de los seres vivos',
        pregunta: 'Las proteínas, como la hemoglobina o el colágeno, están formadas por aminoácidos unidos mediante enlaces:',
        opciones: ['Glucosídicos', 'Fosfodiéster', 'Iónicos', 'Peptídicos'],
        respuesta: 3,
        explicacion: 'El enlace peptídico une el grupo carboxilo de un aminoácido con el grupo amino del siguiente, liberando una molécula de agua. Los glucosídicos unen azúcares y los fosfodiéster unen nucleótidos.'
    },
    {
        id: 59, tipo: 'seleccion_multiple',
        subtema: 'Composición química de los seres vivos',
        pregunta: '¿Cuáles de las siguientes son funciones del agua en los seres vivos? (Selecciona todas las correctas)',
        opciones: ['Almacenar la información genética', 'Actuar como disolvente de muchas sustancias', 'Ser la principal fuente de energía de la célula', 'Ayudar a regular la temperatura corporal'],
        respuestas: [1, 3],
        explicacion: 'El agua disuelve y transporta muchas sustancias gracias a su polaridad, y por su alto calor específico y su alto calor de vaporización ayuda a regular la temperatura (al evaporarse el sudor, enfría el cuerpo). No aporta energía ni almacena información genética.'
    },
    {
        id: 60, tipo: 'emparejamiento',
        subtema: 'Composición química de los seres vivos',
        pregunta: 'Empareja cada biomolécula con su descripción:',
        columna_a: ['Hemoglobina', 'Colesterol', 'ADN', 'Almidón'],
        columna_b: ['Ácido nucleico que guarda la información genética', 'Polisacárido de reserva energética en los vegetales', 'Proteína que transporta oxígeno en la sangre (contiene hierro)', 'Lípido (esteroide) que forma parte de las membranas celulares'],
        pares: [2, 3, 0, 1],
        explicacion: 'La hemoglobina es una proteína con hierro que transporta O₂. El colesterol es un lípido esteroide de las membranas. El ADN es un ácido nucleico. El almidón es el polisacárido de reserva de las plantas (papa, arroz, yuca).'
    },
];
