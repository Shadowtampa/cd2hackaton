

 export const Login = async (usuario : string, senha : string) => {

  try{  

    const rawResponse = await fetch("http://localhost:8000/usuarios/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario:usuario,
        senha: senha,
      })
    });

    //create a routine to validate response and set goToDashboard: false if not validated
    const content = await rawResponse.json();

    if (!content.ok) {
      throw new Error('Login failed');
    }
    console.log(content);

    const result = { ...content};
    
   return result;
  }catch(error){
    alert('Error login to platform');
  }
    
  }



