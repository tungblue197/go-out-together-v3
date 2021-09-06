import React, { memo } from "react";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextInput from "../input/TextInput";
import Button from "components/button";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import AuthService from "service/auth";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const LoginForm = memo(function LoginForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const [, setCookie] = useCookies();

  const { mutate } = useMutation(AuthService.register, {
    onSuccess: ({ data }) => {
      if (data) {
        setCookie("accessToken", data.accessToken);
        const { user } = data;
        for (const key in user) {
          if (user[key]) {
            setCookie(key, user[key]);
          }
        }
        router.replace('/user')
      }
    },
  });
  const handleRegisterSubmit = (value: any) => {
    mutate(value);
  };
  return (
    <div className="w-full px-4 py-4 shadow-2xl rounded-xl max-w-md relative bg-white h-screen md:h-auto">
      <div className="w-full z-1 mt-10">
        <div className="flex flex-col justify-center items-center">
          <span className="uppercase text-xl font-semibold text-gray-500">
            Đăng ký
          </span>
          <span className="text-sm text-blue-300">Cùng đi chơi</span>
        </div>
        <TextInput
          error={errors.username}
          register={register("username", {
            required: "Bắt buộc nhập tài khoản",
          })}
          label="Tài khoản"
        />
        <TextInput
          error={errors.password}
          register={register("password", {
            required: "Bắt buộc nhập mật khẩu",
          })}
          label="Mật khẩu"
          type="password"
        />
        <TextInput
          label="Tên của bạn"
          type="text"
          placeholder="DV: TùngPV"
          register={register("fullName")}
        />
        <div className="py-4">
          <Button
            type="primary"
            onClick={(e) => {
              handleSubmit(handleRegisterSubmit)();
            }}
            outline
          >
            Đăng ký
          </Button>
        </div>
        <div className="py-4">
          <Button type="primary">Quay về đăng nhập</Button>
        </div>
      </div>
    </div>
  );
});

export default LoginForm;
