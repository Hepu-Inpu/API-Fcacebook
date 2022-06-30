const API = "https://graph.facebook.com/";
const CAMPOS = "?fields=id,name,email,picture&";
const TOKEN =
    "access_token=EAAJ9Uzgi7GABADZBrQZBZAf529oXy3sOJEthJ5FW2IhsMVKfbfhwfWLhg7oTP96uy5tosmsWJSsuo4OWVQkxiCFmCefRM5eYLj8ExjdsPLGnJODqEZABZBQtrzCemThsTq4Qys5dvk0vilai7RTcMavOHM44wh259KF1PLZAcbKp772FwsQ38gQgcra7c9nx80ZC2UHPhh5LXLAr8EWWjfEAxsqPllL3KUq22aSOfYx4RDmYd2VjIlhdDa8UyP2mvwZD";
// angie 100006374922337
// miguel 100024871119252

//Creamos una constante con la instancia de vue
const app = Vue.createApp({
    //propiedad “data” que sirve para definir todos los datos que queremos que Vue tenga disponible para mostrarlos en nuestro html.
    data() {
        return {
            //esta propiedad guardara lo que escribamos en el input con el v-model
            ID: null,
            resultado: null,
            error: null,
            favorit: new Map(),
        }
    },
    //created es un ciclo de vida de vue
    // el created es para que se guarden sin necesidad de entrar en el DOM (al modelo)
    created() {
    //colocamos el parse para transformar y renderizar la cadena de texto que viene en el fav 
    // covertimos el string super largo en un formato JSON
        const DatosLike = JSON.parse(window.localStorage.getItem('fav'))
        
    //decimos que si DatosLike exite y si tiene longitud o tiene algo 
        if(DatosLike?.length){
        //ceamos una nueva constante map 
        //me baso del mep anterior para colocar e id como key y el map completo como value
            const like2 = new Map(
                DatosLike.map(alias=>[alias.id,alias])
            )
            // le asignamos el map que acabmos de crear en el map antiguo para mostrar el DOM
            this.favorit = like2
        
        }
    },
    // esta funcion computed es una palabra reservada de las propiedades computadasdonde 
    //se guardan como la logica para no llenar el DOM y sobrecargarlo
    computed: {
        //creamos un metodo que valida si el ID buscado o ingresado en el inputl lo tiene (has) en en Favoritos
        Valida() {
            return this.favorit.has(this.resultado.id)
        },
        //Creamos  un metodod Todos donde se van a guardar en una propiedad Array Todos los valores de la propiedad map llamada favorit
        Todos() {
         //Como el map()  no es array, entonces no se puede recorrer
            //para esto creamos una nueva función UpdateStore donde creamos el map() en array con Array.from
            return Array.from(this.favorit.values())
        }
    },


    //Creamos un metodo
    methods: {
        //Agregamos una función asíncrona llamada "consulta()”, se le creo una constante Llamada respuesta , concatenando la API, ID y token de acceso
        async consulta() {
            //cada vez que inicie este motodo todo inicialice en null y la busqueda sea limpia 
            this.resultado = this.error = null;
            //realizamos un trycatch para facilitar la leida de errores
            try {
                //this.mensaje contiene lo que ingresamos en el input
                const respuesta = await fetch(API + this.ID + CAMPOS + TOKEN);
                if (!respuesta.ok) throw new Error("Usuario no existe")
                //Después creamos una constante que leyera los datos de la API en formato JSON
                const ResJson = await respuesta.json();
                //mostramos por consola
                console.log(ResJson);
                this.resultado = ResJson;
            } catch (e) {
                this.error = e
            } finally {
                this.ID = null
            }
        },

        AddLike() {// se crea nuevo metodo añadir los favoritos
            //en la propiedad Map llamada favorit guardamos una key que es el id del resultado y el valor que es toda la busqueda
            this.favorit.set(this.resultado.id, this.resultado)
            this.UpdateStore()
        },
        DeleteLike() {// se crea metodo para borrar los favoritos
            //para esto utlizamos la palabra delete reservada y le enviamos el id del resultado seleccionado
            this.favorit.delete(this.resultado.id)
            this.UpdateStore();
        },
        UpdateStore() {// es para actualizar la vista con los favoritos que estan actualmente
           //debemos convertir la información que queremos guardar en el localstorage pero no se puede 
           //ya que originalmente lo que tenemos es un array, lo devemos poner en cadena de texto
           //El stringify vuelve todo a una cadena de datos
            window.localStorage.setItem('fav', JSON.stringify(this.Todos))
        },
        Showfa(id){
        this.resultado = id
        }
    }
});

