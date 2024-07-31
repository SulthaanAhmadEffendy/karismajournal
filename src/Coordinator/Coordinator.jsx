import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, Dialog } from '@material-tailwind/react';

function Koordinator() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(
        'https://journal.bariqfirjatullah.pw/api/coordinator',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoordinators(data.data || []);
    } catch (error) {
      console.error('Failed to fetch coordinators:', error);
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className=''>
        <div className='container mx-auto px-4 py-6'>
          <CardBody>
            <div className='overflow-x-auto '>
              <table className='w-fit min-w-[320px] table-auto rounded-lg'>
                <thead className='bg-gray-800 text-white rounded-t-lg'>
                  <tr>
                    <th className='py-3 px-4 text-left font-bold'>
                      Coordinators
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='2' className='text-center py-4'>
                        Processing...
                      </td>
                    </tr>
                  ) : coordinators.length ? (
                    coordinators.map((item) => (
                      <tr key={item.id} className='border-t'>
                        <td className='py-3 px-4'>{item.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='2' className='text-center py-4'>
                        No Coordinators found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </div>
      </Card>
    </>
  );
}

export default Koordinator;
