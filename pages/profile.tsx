import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button";
import LightLayout from "layouts/LightLayout";
import { NextPage } from "next";
import Image from "next/image";
import TextInput from "components/input/TextInput";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useCookies } from "react-cookie";
import UserService from 'service/user';
import { store } from 'react-notifications-component';
import withAuth from "hocs/withAuth";

const Profile: NextPage = () => {
  const fileRef = useRef<any>();
  const [cookies] = useCookies()
  const { data } = useQuery(['users', cookies.id], () => UserService.getUserById(cookies.id))
  const { mutate } = useMutation(UserService.update, {
    onSuccess: (data) => {
      console.log(data)
      store.addNotification({
        title: "Thông báo!",
        message: "Lưu thành công",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
    }
  })
  const { register, handleSubmit } = useForm({ defaultValues: data as any });

  const openFileUploader = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleUploadPhoto = (e: any) => {
    const file = e.target.files[0];
    if(file){
        //upload - file
    }
  }

  const handleProfileSubmit = (value: any) => {
    if(value.gender) value.gender = Number(value.gender)
    mutate({ user: value })
  }

  return (
    <LightLayout>
      <div className="w-full md:max-w-xl mx-auto border bg-white rounded p-4 mt-2">
        <div className="flex justify-center">
          <div className="relative rounded-full">
            <input type="file" ref={fileRef} className="hidden" onChange={handleUploadPhoto} />
            <Image
              src={"/images/default-user.png"}
              width={120}
              height={120}
              alt="user-image"
            ></Image>
            <div
              onClick={openFileUploader}
              className="w-full text-gray-50 flex justify-center bg-blue-500 rounded cursor-pointer
            "
            >
              <Button type="primary">
                <FontAwesomeIcon className="text-xl" icon={faCamera} />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <TextInput label="Họ và tên" register={register('fullName')} />
          <TextInput label="Email"  register={register('email')}/>
          <div className="flex gap-x-2">
            <div className="text-gray-500 flex flex-col my-2 flex-1">
              <label className="text-sm font-semibold mb-1">Ngày sinh</label>
              <input {...register('birthday')} type="date" className="outline-none border rounded p-1" />
            </div>
            <div className="text-gray-500 flex flex-col my-2 flex-1">
              <label className="text-sm font-semibold mb-1">Giới tính</label>
              <select {...register('gender')} className="outline-none border rounded px-1 py-2 text-sm">
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </select>
            </div>
          </div>
          <div>
            <TextInput register={register('address')} label="Địa chỉ"></TextInput>
          </div>
          <div className="text-sm text-gray-500 font-semibold my-4">
            <label className="mb-2 block">Ghi chú</label>
            <textarea {...register('note')} className="w-full border outline-none focus:ring-2 rounded h-20 px-1 text-sm text-gray-600"></textarea>
          </div>
          <div className='flex flex-end w-full'>
            <Button 
              onClick={e => {
                handleSubmit(handleProfileSubmit)()
              }}
            type='success'>Lưu</Button>
          </div>
        </div>
      </div>
    </LightLayout>
  );
};

export default withAuth(Profile);
