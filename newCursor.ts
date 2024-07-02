interface EncodedData {
    encodedString: string;
    paddingZerosCount: number;
}

function convertToCustomCharacterSetGroups(binaryArray: number[], groupSize: number, customCharacterSet: string): EncodedData {
    const groups: string[] = [];
    const paddedBinaryArray: number[] = [...binaryArray]; // Copia del arreglo binario
    let paddingZerosCount = 0;

    // Calcular el número de bits de relleno necesario
    const remainder = binaryArray.length % groupSize;
    if (remainder !== 0) {
        const paddingLength = groupSize - remainder;
        for (let i = 0; i < paddingLength; i++) {
            paddedBinaryArray.push(0);
            paddingZerosCount++;
        }
    }

    // Convertir cada grupo de `groupSize` bits a un símbolo del conjunto personalizado
    for (let i = 0; i < paddedBinaryArray.length; i += groupSize) {
        const binaryGroup = paddedBinaryArray.slice(i, i + groupSize); // Obtener un grupo de `groupSize` bits
        const groupValue = parseInt(binaryGroup.join(''), 2); // Convertir a número entero
        groups.push(customCharacterSet.charAt(groupValue % customCharacterSet.length)); // Obtener el símbolo correspondiente en el conjunto personalizado
    }

    return { encodedString: groups.join(''), paddingZerosCount };
}

function convertFromCustomCharacterSetGroups(groups: string[], groupSize: number, customCharacterSet: string, paddingZerosCount: number): number[] {
    const binaryArray: number[] = [];

    // Convertir cada símbolo del conjunto personalizado a su representación binaria de `groupSize` bits
    for (let i = 0; i < groups.length - 1; i++) {
        const group = groups[i];
        const groupValue = customCharacterSet.indexOf(group); // Obtener el valor del símbolo en el conjunto personalizado
        const binaryString = groupValue.toString(2).padStart(groupSize, '0'); // Convertir a binario de `groupSize` bits
        for (let bit of binaryString) {
            binaryArray.push(parseInt(bit)); // Agregar cada bit al arreglo binario
        }
    }

    // Convertir el último símbolo del conjunto personalizado a su representación binaria de `groupSize` bits
    const lastGroup = groups[groups.length - 1];
    const lastGroupValue = customCharacterSet.indexOf(lastGroup); // Obtener el valor del último símbolo en el conjunto personalizado
    const lastBinaryString = lastGroupValue.toString(2).padStart(groupSize, '0'); // Convertir a binario de `groupSize` bits

    // Eliminar los bits de relleno al final del último grupo
    const actualGroupSize = groupSize - paddingZerosCount;
    for (let i = 0; i < actualGroupSize; i++) {
        binaryArray.push(parseInt(lastBinaryString[i])); // Agregar cada bit al arreglo binario
    }

    return binaryArray;
}

function generateRandomBinaryArray(length: number): number[] {
    const binaryArray: number[] = [];
    for (let i = 0; i < length; i++) {
        const randomBit = Math.random() < 0.5 ? 0 : 1; // Generar aleatoriamente 0 o 1
        binaryArray.push(randomBit);
    }
    return binaryArray;
}

function getRandomNonZeroIndices(binaryArray: number[], count: number): number[] {
    const nonZeroIndices: number[] = [];
    const zeroIndices: number[] = [];

    // Encontrar los índices de los elementos que no son cero y los que son cero
    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] !== 0) {
            nonZeroIndices.push(i);
        } else {
            zeroIndices.push(i);
        }
    }

    // Seleccionar de manera aleatoria los índices de elementos no cero
    const selectedIndices: number[] = [];
    while (selectedIndices.length < count && nonZeroIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * nonZeroIndices.length);
        selectedIndices.push(nonZeroIndices[randomIndex]);
        nonZeroIndices.splice(randomIndex, 1); // Eliminar el índice seleccionado para evitar repeticiones
    }

    // Si no hay suficientes elementos no cero, seleccionar aleatoriamente de los elementos cero
    while (selectedIndices.length < count) {
        const randomIndex = Math.floor(Math.random() * zeroIndices.length);
        selectedIndices.push(zeroIndices[randomIndex]);
    }

    return selectedIndices;
}

function setIndicesToOneAndEncode(indices: number[], encodedData: EncodedData, customCharacterSet: string): string {
    const binaryArray: number[] = [];

    // Convertir la cadena codificada a representación binaria
    for (let group of encodedData.encodedString.split('')) {
        const groupValue = customCharacterSet.indexOf(group); // Obtener el valor del símbolo en el conjunto personalizado
        const binaryString = groupValue.toString(2).padStart(6, '0'); // Convertir a binario de 6 bits
        for (let bit of binaryString) {
            binaryArray.push(parseInt(bit)); // Agregar cada bit al arreglo binario
        }
    }

    // Establecer los índices en 1
    for (let index of indices) {
        binaryArray[index] = 1;
    }

    // Convertir la representación binaria modificada a la cadena codificada
    let encodedStringModified = '';
    for (let i = 0; i < binaryArray.length; i += 6) {
        const binaryGroup = binaryArray.slice(i, i + 6).join('');
        const groupValue = parseInt(binaryGroup, 2);
        encodedStringModified += customCharacterSet.charAt(groupValue % customCharacterSet.length);
    }

    return encodedStringModified;
}

function main() {
    const customCharacterSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    console.log('custom character set length:', customCharacterSet.length)
    const binaryArray: number[] = generateRandomBinaryArray(5000);
    console.log("Original binary array:", binaryArray);
    const groupSize = 6;
    const { encodedString, paddingZerosCount } = convertToCustomCharacterSetGroups(binaryArray, groupSize, customCharacterSet);
    console.log("Encoded string:", encodedString);
    console.log("Encoded string length:", encodedString.length);
    const reconstructedBinaryArray: number[] = convertFromCustomCharacterSetGroups(encodedString.split(''), groupSize, customCharacterSet, paddingZerosCount);
    console.log("Reconstructed binary array:", reconstructedBinaryArray);
    const isEqual = JSON.stringify(binaryArray) === JSON.stringify(reconstructedBinaryArray);
    console.log("Is original binary array equal to reconstructed binary array?", isEqual);

    const randomNonZeroIndices = getRandomNonZeroIndices(encodedString.split('').map(char => customCharacterSet.indexOf(char)), 5);
    console.log("Random non-zero indices:", randomNonZeroIndices);
}

main();
