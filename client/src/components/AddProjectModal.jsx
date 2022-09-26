import { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PROJECT } from '../mutations/projectMutations';
import { GET_PROJECTS } from '../queries/projectQueries';
import { GET_CLIENTS } from '../queries/clientQueries';

export default function AddProjectModal() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setclientId] = useState('');
  const [status, setStatus] = useState('new');

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, status, clientId },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: projects.concat([addProject]) },
      });
    },
  });

  // Get Clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === '' || description === '' || status === '') {
      return alert('Please fill in all fields');
    }

    addProject(name, description, clientId, status);

    // addProject(name, description, clientId);
    setName('');
    setDescription('');
    setStatus('new');
    setclientId('');
  };

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type='button'
            className='btn btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#addProjectModal'
          >
            <div className='d-flex align-items-center'>
              <FaList className='icon' />
              <div> New Project</div>
            </div>
          </button>

          <div
            className='modal fade'
            id='addProjectModal'
            aria-labelledby='addProjectModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5
                    className='modal-title'
                    id='addProjectModalLabel'
                  >
                    New Project
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={onSubmit}>
                    <div className='mb-3'>
                      <label
                        htmlFor='name'
                        className='form-label'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='name'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='description'
                        className='form-label'
                      >
                        Description
                      </label>
                      <textarea
                        type='description'
                        className='form-control'
                        id='description'
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className='mb-3'>
                      <label
                        htmlFor='status'
                        className='form-label'
                      >
                        Status
                      </label>
                      <select
                        className='form-select'
                        id='status'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value='new'>Not Started</option>
                        <option value='progress'>In Progress </option>
                        <option value='completed'>Completed</option>
                      </select>
                    </div>

                    <div className='mb-3'>
                      <label
                        htmlFor='client'
                        className='form-label'
                      >
                        Client
                      </label>
                      <select
                        className='form-select'
                        id='client'
                        value={clientId}
                        onChange={(e) => setclientId(e.target.value)}
                      >
                        <option value=''>Select Client</option>
                        {data.clients.map((client) => (
                          <option
                            key={client.id}
                            value={client.id}
                          >
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type='submit'
                      data-bs-dismiss='modal'
                      className='btn btn-primary'
                    >
                      Add Project
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
