import { useQuery } from '@apollo/client';
import { GET_CLIENTS } from '../queries/clientQueries';
import ClientRow from './ClientRow';
import Spinner from './Spinner';

export default function Clients() {
  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <Spinner />;
  if (error) return `Error! ${error.message}`;

  return (
    <>
      {!loading && !error && (
        <table className='table table-hober mt-3'>
          <thead>
            <tr className='table-primary'>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
