//firstname
// lastname
// email
// phone
// license no

function Register() {
  return (
    <div>
      <div className="flex h-screen justify-center w-full items-center">
        {/*left*/}

        <div className=" h-full w-full border-r-2 border-gray-600">info</div>
        

        <div className="hidden lg:block h-full w-full">
          <img
            src={
              "https://images.pexels.com/photos/15072149/pexels-photo-15072149.jpeg"
            }
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      <footer>footer</footer>
    </div>
  );
}

export default Register;
