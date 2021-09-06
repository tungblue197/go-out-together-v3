import TextInput from 'components/input/TextInput'
import LightLayout from 'layouts/LightLayout'
import type { NextPage } from 'next'
import Button from 'components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faChevronLeft, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Map from 'components/map';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Location } from 'type';
import UserService from 'service/user';
import { useMutation } from 'react-query';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import withAuth from 'hocs/withAuth';

const UserPage: NextPage = () => {
    const [showMap, setShowMap] = useState(false)
    const router = useRouter()
    const [cookies, setCookie] = useCookies()
    const { register, formState: {
        errors
    }, handleSubmit } = useForm({
        defaultValues: {
            fullName: cookies.fullName || ''
        }
    })
    
    const [locations, setLocations] = useState<(Location & { marker: any})[]>([]);
    const { mutate } = useMutation(UserService.update, {
        onMutate: (data) => {
            console.log('data : ', data);
            if(data){
                const { location } = data;
                setCookie('locationId', location.id);
                setCookie('placeName', location.placeName)
                router.push('/session/create')
            }
        }
    })
    const handleUserSubmit = (value: any) => {
        if(!locations?.length) {
            alert('Vui lòng chọn địa điểm của bạn')
            return;
        }
        const user = {...value, id: cookies.id, location:  locations[locations.length - 1]?.id}
        const location = locations[locations.length - 1]
        mutate({ user, location })
    }
    const handleLocationChanged = (locs: (Location & { marker: any})[]) => {
        setLocations(locs)
    }
    return (
        <LightLayout>
            <div className='max-w-lg mt-4 shadow-xl mx-auto border rounded p-4 relative'>
                <TextInput label='Tên' register={register('fullName', { required: 'Bắt buộc nhập tên'})} error={errors.fullName}/>
                <div className='mt-4'>
                    <Button onClick={e => setShowMap(true)} type='primary' outline>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span className='ml-2'>Chon đị điểm của bạn</span>
                    </Button>
                </div>
                <TextInput label='Địa điểm' value={locations?.length ? locations[locations.length - 1]?.placeName : null} />
                <div className='flex justify-end mt-2 space-x-2'>
                    <div className="w-3/6">
                        <Button type='danger'><FontAwesomeIcon className='mr-2' icon={faChevronLeft} /> Trở lại </Button>
                    </div>
                    <div className="w-3/6">
                        <Button type='primary' onClick={e => {
                            e.preventDefault()
                            handleSubmit(handleUserSubmit)()
                        }}>Tiếp tục <FontAwesomeIcon className='ml-2' icon={faChevronRight} /></Button>
                    </div>
                </div>
            </div>
            {
                showMap && <div className='absolute top-0 left-0 right-0 bottom-0'> <Map locationChanged={handleLocationChanged} locations={locations} onCloseMap={() => setShowMap(false)} /></div>
            }

        </LightLayout>
    )
}

export default withAuth(UserPage)
