const apiPost = "https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/posts/"  ;
const apiUser = "https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/users/"  ;
let users = [] ;


// funcion para mostrar los posts
const printPost = async() => {
  // esperar hasta que se cargen los usuarios
  await generateUserList() ;

  // una vez cargado los usuarios, cargamos los posts 
  let listPosts = await getPosts() ;
  if(listPosts.length > 0){
    let node = ""  ;
    listPosts.forEach((item) => {
      let _userName = searchUser(item.userId) ;
      node += '<div class="col-8 offset-2"><div class=" postItem">' ;
      node += '<span class="username"><i class="fas fa-user-circle"></i> '+ _userName[0].username +'</span><span class="postTitle">'+ item.title +'</span><span class="postComments"><i class="far fa-comments"></i> Comments</span>' ;
      node += "</div></div>"  ;
    });
    $(".listPosts").html(node) ;
  }
}

// funcion que devuelve info del usuario si este existe en la variable global "users"
const searchUser = (userId) => {
  if(users.length > 0){
      return  users.filter((elem)=>{
        return elem.id === userId ;
      }) ;
  }
  return "User not found" ;

}
// function para generar lista de los usuarios
const generateUserList = async () => {
  userList =  await getUsers() ;
  userList.forEach((item) => {
    let userInfo = {"id": item.id, "username": item.name}
    users.push(userInfo) ;
  });


}

// funcion para cargar los datos de los posts
const  getPosts = async () => {
  console.log("Getting parkings details...") ;

  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiPost,
      method: "GET"
    })
    .done((response) => {
      resolve(response) ;
    })
    .fail(() => reject("Something went wrong with api!!!")) ;

  }) ;
}

// función para caragr los usuarios
const  getUsers = async () => {
  console.log("Getting users details...") ;

  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUser,
      method: "GET"
    })
    .done((response) => {
      resolve(response) ;
    })
    .fail(() => reject("Something went wrong with api!!!")) ;

  }) ;
}



// init
$(document).ready(function(){
  printPost() ;
}) ;
