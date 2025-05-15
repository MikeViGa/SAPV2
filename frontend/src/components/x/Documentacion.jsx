/*

.jsx es Javascript extension
Un componente React:
    No es interpretable en un navegador
    Hay componentes incluidos (built in) y persovnalizados (custom)
    El nombre del archivo que contiene el componente debe coincidir con el nombre del componente
    Los componentes se pueden o no exportar con export

Un cmponente debe devolver solo un elemento padre "html" (con sub elementos dentro de él)
Se puede realizar envolviendo todo el "html":
    Dentro de div (aunque produce un div inutil)
    Dentro de Fragment (No produce div inutil)
    Dentro de <></> (No produce div inutil)
                    
En Los componentes built in:
    Su nombre empieza por minuscula
    Solo existen elementos definidos en HTML

En los componentes custom:
    Su nombre debe iniciar en mayúsculas
    Debe seguir nombres bajo PascalCase para más de una palabra

Los componentes contienen una función que:
    Debe devolver un valor que pueda ser mostrado en la pantalla por React

Se puede agregar codigo javascript en un componente React dentro del "html" empleando las llaves: {}

Se pueden pasar parametros a un componente
    Las props son "atributos html" pero custom
    Cuando se pasan propiedades, estos se agrupan en un objeto en formato llave-valor

Los componentes de React se ejecutan una sola vez por default
Si se requiere ejecutar nuevamente hay que solicitarlo explicitamente para actualizar la UI
Para ello se emplean los hooks y se deben importar con useState

Se utilizan dentro de los componentes React o dentro de Hooks customs
Deben de invocarse en el nivel mas alto o al inicio del componente React
useState(); Permite controlar el estado de un componente mediante una variable y una función especiales o controladas por React
Acepta un argumento, es el valor por default con el que inciará la variable
Devuelve un arreglo que contiene:
    Una variable que contiene el valor del estado, puede cambiar si el componente se vuelve a ejecutar
    Una funcion que actualiza a la variable de estado, indica a React que debe reejecutar el componente actulizando el estado
    Cuando se invoca a la funcion (y se establece un nuevo valor a la variable), React actualiza o re ejecuta el componente y el nuevo valor de la variable estará disponible despues de la re ejecución

Re ejecucion de componentes condicionalmente
1.- Puede hacerse empleando una condicional sobre la variable de control y empleando contenido dinámico {variable?Contenido:null}
2.- Puede hacerse empleando una conjuncion de la variable de control con el contenido {variable&&Contenido}

Los componentes pueden tener un atributo que los identifique mediante key


Para separar un componente en varios componentes deben evaluarse 
Si un componente hace más de una funcion (cohesion)
Si los elementos de un componente tienen una funcion definida o deben poseer su propio estado


*/






////////////////////////////////////////Tipos de datos

//Los tipos de datos numéricos, cadenas, booleanos, null y undefined son no mutables
//Se acceden por valor, no se pueden modificar, en lugar de ello se reemplazan por nuevas copias 

const mensaje="Hola";
mensaje = mensaje+"que tal"; //A mensaje se le asigna una nueva cadena

//Los tipos de datos Arreglos, Set, Map y en general los objetos son mutables
//Se acceden por referencia, se modifican sus valores directamente

const numeros = ["uno", "dos", "tres"]; //const nuemros no almacena al arreglo sino que solo la direccion del arreglo
//La direccion no puede cambiar por "const" pero si puede cambiar el contenido del arreglo al que apunta
numeros.push("cuatro"); //Se modifica directamente al arreglo original numeros


////////////////////////////////////////Arreglos

//Unidimensional

const pasatiempos = ["Leer", "Ejercicio", "Cocinar"];

//Multidimensional

const verbos = [
    ["Leer", "Ejercicio", "Cocinar"],
    ["Remar", "Pintar", "Saltar"],
    ["Creer", "Llamar", "Colgar"]
];


//Metodos de arreglos

//Map.- Invoca a una callback function (pasada como parametro) por cada elemento del arreglo
//Devuelve un nuevo arreglo con los resultados después de iterar todo el arreglo

pasatiempos.map((elemento) => elemento + "!")


////////////////////////////////////////Funciones
//Tradicionales 
function miFuncion(){
    console.log("Hola");
}

//Anonimas
/*
function(){
    console.log("Hola");
}
*/
//Arrow

//Anonima sin argumentos
() => {
    console.log("Hola");
}

//Anonima con 1 argumento

(variable) => {
    console.log(variable);
}

//Si solo hay un argumento se pueden eliminar los parentesis

variable => {
    console.log(variable);
}

//Si solo existe la instruccion return, 

numero => {
    return numero+1;
}

//se puede omitir la kw return

numero =>  numero+1;

////////////////////////////////////////Funciones como parámetros
//Conocidas como funciones de primera clase o callback
//Permite que una funcion se ejecute después de que la otra haya terminado su ejecución
//Su utilidad se centra en:
//1.- Modificar el comportamiento (dinámico) de la funcion que recibe dependiendo de la función recibida
//2.- En operaciones asincronas donde los eventos no ocurren de manera inmediata

//Cuando se pasa una funcion como parametro no se usan parentesis
//Si se coloca parentesis la funcion parámetro está obligada a devolver un valor antes de quien la invoca se ejecute 

function manejaTiempoEspera1(){
    console.log("TErminado");
}

setTimeout(manejaTiempoEspera, 2000);

//Utilizando funciones arrow anonimas separadas
const manejaTiempoEspera2 = () => {
    console.log("Terminado")
}

setTimeout(manejaTiempoEspera2, 2000);

//Utilizando funciones arrow anonimas anidadas

setTimeout(()=>{
    console.log("Terminado");
}, 2000);


////////////////////////////////////////Funciones definidas dentro de funciones
//La funcion saludo se deine y se invoca dentro de la misma funcion iniciar. 
//No se puede invocar fuera pues la definicion ocurre dentro de iniciar

function iniciar(){
    function saludo(){
        console.log("Hola");
    }
    saludo();
}

////////////////////////////////////////Objetos

const user={
    name: "Juan",
    edad: 34,

    saludo(){
        console.log("Hola");
        console.log(this.edad);
    }
}

console.log(user.edad);

////////////////////////////////////////Clases

class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    saludo() {
        console.log("Hola " + this.name);
    }
}

const usuario1=new Usuario("Juan", 54);

////////////////////////Operador spread (...)
//Sintaxis de expansion (spread).- Expande un elemento iterable(cadenas, arreglos, objetos) en sus elementos 
//Sintaxis de contraccion (rest).- Contrae varios elementos en uno
//Util cuando todos los elementos del iterable se deben incluir en un nuevo arreglo u objeto o cuando deben ser pasados como una lista de argumentos

const numbers = [1, 2, 3];
console.log(...numbers);     // 1 2 3

console.log(..."Hola")       // "H" "o" "l" "a"


function sum(x, y, z) {
    return x + y + z;
  }
  
console.log(sum(...numbers)); // 6


////////////////////////Operadores

// = Asignación
// == Comparación débil, Compara la igualdad de dos valores sin tomar en cuenta su tipo de dato, 5=="5" es true
// === Comparación estricta, Compara laigualdad de dos valores incluyendo su tipo de dato, 5=="5" es false
