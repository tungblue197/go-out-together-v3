import React, { memo } from "react";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextInput from "../input/TextInput";
import Button from "components/button";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import AuthService from "service/auth";
import { useRouter } from "next/router";
const LoginForm = memo(function LoginForm(props) {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [, setCookie] = useCookies();
  const { mutate, error } = useMutation(AuthService.login, {
    onSuccess: ({ data }) => {
      if (data) {
        const { user } = data;
        setCookie("accessToken", data.accessToken);
        for(const key in user){
            if(user[key]){
                setCookie(key, user[key]);
            }
        }
        router.replace("/user");
      }
    },
  });
  console.log(error)
  const handleLoginSubmit = (value: any) => {
    mutate(value);
  };
  return (
    <div className="w-full px-4 py-4 shadow-2xl rounded-xl max-w-md relative bg-white">
      <div className="absolute  -top-14 w-full pos-x-center max-w-md flex justify-center z-0 rounded-full ">
        <Image
          src={"/images/shibameme.jpeg"}
          width={100}
          height={100}
          className="rounded-full"
          alt="user meme"
        />
      </div>
      <div className="w-full z-1 mt-10">
        <div className="flex flex-col justify-center items-center">
          <span className="uppercase text-xl font-semibold text-gray-500">
            Đăng nhập
          </span>
          <span className="text-sm text-blue-300">Cùng đi chơi</span>
        </div>
        <TextInput
          error={errors.username}
          register={register("username", {
            required: "Không được bỏ trống tài khoản",
          })}
          label="Tài khoản"
        />
        <TextInput
          error={errors.password}
          register={register("password", {
            required: "Không được bỏ trống mật khẩu",
          })}
          label="Mật khẩu"
          type="password"
        />
        <div className='text-xs text-red-600'>{error ? 'Sai tài khoản hoạc mật khẩu' : null}</div>
        <div className="mt-1">
          <span className="text-gray-500 text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/register">
              <a className="text-blue-400">Đăng ký</a>
            </Link>
          </span>
        </div>
        <div className="py-4">
          <Button
            onClick={(e) => {
              handleSubmit(handleLoginSubmit)();
            }}
            type="primary"
          >
            Đăng nhập
          </Button>
        </div>
        
        <div className="border-b border-w-2 relative">
          <span className="absolute pos-center bg-white text-xs text-gray-400">
            Or
          </span>
        </div>

        <div className="my-4">
          <Button outline={true}>
            <Image src={"/images/google-icon.png"} width={16} height={16} />
            <span className="ml-2">Đăng nhập với goole</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default LoginForm;
