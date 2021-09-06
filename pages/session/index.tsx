import withAuth from "hocs/withAuth";
import LightLayout from "layouts/LightLayout";

const Session = () => {
  return (
    <LightLayout>
      <div className="w-full md:max-w-2xl border my-2 mx-auto shadow rounded">
      <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                Tiêu đề số 1
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
               Nội dung số 01
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Hoàn thành
                </span>
              </td>
            </tr>
          </tbody>
          </table>
      </div>
    </LightLayout>
  );
};

export default withAuth(Session);
