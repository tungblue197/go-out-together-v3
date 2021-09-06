import Button from "components/button";
import LightLayout from "layouts/LightLayout";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import SessionService from 'service/session'

const ResultPage = () => {
  const { query } = useRouter()

  const { data } = useQuery(['session', query.id], () => SessionService.getById(query.id))
  const session = data?.data || {};
  console.log(session)
  return (
    <LightLayout>
      <div className='w-full md:max-w-2xl border rounded mx-auto mt-4 text-center py-4'>
          <div className='text-sm text-gray-600 text-center'>
                Tiêu đề: {session.title}, Nội dung: {session.content}
          </div>
          <div className='text-sm text-gray-600 text-center font-semibold mt-2'>
                {
                  
                }
          </div>
          <div className='w-40 mx-auto my-2'>
              <Button type='primary'>Xem trên map</Button>
          </div>
      </div>
    </LightLayout>
  );
};

export default ResultPage;
