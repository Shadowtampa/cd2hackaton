

 export const Login = async (email : string, password : string) => {

  try{  

    const rawResponse = await fetch("http://localhost:8000", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email:email,
        password: password,
      })
    });

    //create a routine to validate response and set goToDashboard: false if not validated
    const content = await rawResponse.json();

    const result = { ...content};
    
   return result;
  }catch(error){
    alert('Error login to platform');
  }
    
  }



