import React from "react";
import { CiLock } from "react-icons/ci";
const LoginPage = () => {
  return (
    <>

<div class="max-w-md h-135 relative flex flex-col p-4 rounded-md text-black bg-white">
    <div class="text-2xl font-bold  text-[#1e0e4b] text-center">Login as a Comapny</div>
   
<form class="flex flex-col gap-3 mt-15">
    <div class="block relative"> 
    <label for="email" class="block text-black font-semibold cursor-text text-sm leading-[140%]  mb-2">Email</label>
    <input type="text" id="email" class="rounded border border-gray-300 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"/>
    </div>
     <div>
    <a class="text-sm font-semibold text-[#478aff]" href="#">Login with OTP
    </a>
    </div>
    <div class="block relative"> 
    <label for="password" class="block text-gray-600 cursor-text text-sm leading-[140%] font-semibold mb-2">Password</label>
    <input type="text" id="password" class="rounded border border-gray-300 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"/>
    
    </div>
    <div>
    <a class="text-sm font-semibold text-[#478aff]" href="#">Forgot your password?
    </a></div>
    <button type="submit" class="bg-[#478aff] w-full rounded-4xl m-auto px-6 py-3 text-white text-sm font-normal">Login</button>

  </form>
  <div class="text-sm text-center mt-[1.6rem]">
    Don’t have an account? <a class="text-sm text-[#7747ff]" href="#">Sign up </a></div>
</div>
    </>
  );
};

export default LoginPage;
