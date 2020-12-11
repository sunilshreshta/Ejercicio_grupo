const apiPost = "https://jsonplaceholder.typicode.com/posts/"  ;
const apiUser = "https://jsonplaceholder.typicode.com/users/"  ;
const commentLoader = '<div class="text-center "><i class="fas fa-spinner fa-pulse"></i> Cargando comentarios</div>' ;
let users = [] ;


// funcion para mostrar los posts
const printPost = async() => {
  $(".loader").show() ;
  // esperar hasta que se cargen los usuarios
  await generateUserList() ;

  // una vez cargado los usuarios, cargamos los posts
  let listPosts = await getPosts() ;
  if(listPosts.length > 0){
    let node = ""  ;
    listPosts.forEach((item) => {
      let _userName = searchUser(item.userId) ;
      node += '<div class="col-8 offset-2"><div class=" postItem">' ;
      node += '<span class="username"><i class="fas fa-user-circle"></i> '+ _userName[0].username +'</span> \
              <span class="postTitle">'+ item.title +'</span> \
              <div class="postAccions"><button type="button" data-toggle="collapse" data-target="#post'+ item.id +'" class="btn postComments" data-value="'+ item.id +'"> \
                <i class="far fa-comments"></i> Comments \
              </button></div> \
              <div id="post'+ item.id +'" class="collapse box-postComments"></div>' ;
      node += "</div></div>"  ;
    });
      $(".loader").hide() ;
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
  console.log("Getting posts details...") ;

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


//funcion para cargar los comentarios de un post
const getComments = async (postID) => {
  const endpoint = `https://jsonplaceholder.typicode.com/posts/${postID}/comments` ;
  console.log("Getting post comments ...", endpoint) ;

  return new Promise((resolve, reject) => {
    $.ajax({
      url: endpoint,
      method: "GET"
    })
    .done((response) => {
      resolve(response) ;
    })
    .fail(() => reject("Something went wrong with api!!!")) ;

  }) ;
}

const printComments = (comments, parentNodeId) => {
  if(comments.length > 0){
    let node = '<ul class="listComments">' ;
    comments.forEach((item) => {
      node += '<li> \
                  <span class="userEmail">'+ item.email +'</span> \
                  <span class="commentName">'+ item.name +'</span> \
                  <span class="commentBody">'+ item.body +'</span> \
               </li>'
    });

    node += '</ul>' ;
    $("#" + parentNodeId).html(node) ;
  }
}

$(document).on("click", ".postComments", async function(){
  $(this).toggleClass("pressed") ;
  if($(this).hasClass("pressed")){
    const postID = $(this).attr("data-value") ;
    $("#post"+ postID).html(commentLoader) ;
    
    const comments = await getComments(postID) ;
    printComments(comments, "post" + postID) ;
  }
}) ;
// init
$(document).ready(function(){
  printPost() ;

}) ;
