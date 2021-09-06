import {
  faMapMarkerAlt,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button";
import TextInput from "components/input/TextInput";
import Map from "components/map";
import LightLayout from "layouts/LightLayout";
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Location } from "type";
import SessionService from 'service/session';
import { v4 as uuid } from 'uuid'
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import withAuth from "hocs/withAuth";

const CreatePage: NextPage = () => {
  const [locations, setLocations] = useState<(Location & { marker: any })[]>(
    []
  );
  const router = useRouter()
  const [cookies] = useCookies()
  const handleLocationsChanged = (locs: (Location & { marker: any })[]) => {
    setLocations(locs);
  };

  const handleRemoveLocation = (loc: Location & { marker: any }) => {
    const newLocations = locations.filter((_loc) => _loc.id !== loc.id);
    setLocations(newLocations);
  };

  const [showMap, setShowMap] = useState(false);
  
  const { mutate } = useMutation(SessionService.insert, {
    onSuccess: (result: any) => {
      if(result.success){
        router.push('/session/'+ result.data.id)
      }
    }
  })

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const handleSessionSumit = (value: any) => {
    if(locations.length < 2){
      //thong bao chon di diem
      alert('Vui lòng chọn ít nhất 2 địa điểm')
      return;
    }
    const _locations = locations.map(loc => {
      const _loc = {...loc}
      delete _loc.marker
      return _loc
    })
    value.id = uuid()
    value.createdBy = cookies.id
    value.timeout = Number(value.timeout)
    mutate({ session: value, locations:_locations })
  }
  return (
    <LightLayout>
      <div className="mt-4 w-full md:max-w-xl mx-auto border rounded px-2 py-4 relative">
        <form>
          <div className="py-2">
            <TextInput error={errors.title} register={register('title', { required: 'Bắt buộc nhập tiêu đề'})} label="Tiêu đề"></TextInput>
          </div>
          <div className="pb-4">
            <TextInput error={errors.content} register={register('content', { required: 'Bắt buộc nhập nội dung'})} label="Nội dung"></TextInput>
          </div>
          <div>
            <label className='text-sm text-gray-500 font-semibold mb-2 block'>Thời gian</label>
            <input {...register('timeout', { required: 'Bắt buộc nhập thời gian'})} type='number' className='outline-none border rounded w-full text-sm  px-2 py-2' />
            <div className='text-xs text-red-600'>
                { errors.timeout ? errors.timeout?.message : null}
            </div>
          </div>
          <div className="py-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setShowMap(true);
              }}
              type="primary"
              outline
            >
              Chon những địa điểm
            </Button>
          </div>
          <div className="my-2 text-gray-500 text-sm">
            {!locations.length && (
              <div className="font-semibold text-center mb-4">
                <span>Chưa có địa điểm nào</span>
              </div>
            )}
            <ul>
              {locations.map((loc) => (
                <li key={loc.id} className="px-2 text-blue-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> -{" "}
                  {loc.placeName} -{" "}
                  <FontAwesomeIcon
                    onClick={(e) => handleRemoveLocation(loc)}
                    className="cursor-pointer"
                    icon={faTrashAlt}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-x-2">
            <div className="flex-1">
              <Button type="danger">Trở lại</Button>
            </div>
            <div className="flex-1">
              <Button
                onClick={e => {
                  e.preventDefault()
                  handleSubmit(handleSessionSumit)()
                }}
              type="primary">Tạo nhóm</Button>
            </div>
          </div>
        </form>
       
      </div>
                
      {showMap && (
        <div className="absolute inset-0">
          <Map
            locationChanged={handleLocationsChanged}
            locations={locations}
            onCloseMap={() => setShowMap(false)}
          />
        </div>
      )}
    </LightLayout>
  );
};

export default withAuth(CreatePage);
