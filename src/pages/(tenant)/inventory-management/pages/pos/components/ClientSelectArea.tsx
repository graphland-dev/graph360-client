import { Notify } from '@/_app/common/Notification/Notify';
import { Client, ClientsWithPagination } from '@/_app/graphql-models/graphql';
import { PEOPLE_CREATE_CLIENT } from '@/pages/(tenant)/people/pages/client/utils/client.query';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActionIcon, Button, Drawer, Flex, Input, Space } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Pos_Client_Query } from '../utils/query.pos';

interface ClientFormType {
	name: string;
	email?: string | undefined | null;
	contactNumber: string;
}

import { useLazyQuery } from '@apollo/client';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

const ClientSelectArea: React.FC<{
	formInstance: any;
	contactNumber: string;
	// onRefetch: () => void;
}> = ({ formInstance, contactNumber }) => {
	const [inputData, setInputData] = useState<any[]>([]);
	const [searchedClients, setSearchedClients] = useState<Client[]>([]);

	const [opened, handler] = useDisclosure();

	// client query
	const [fetchClients, { refetch }] = useLazyQuery<{
		people__clients: ClientsWithPagination;
	}>(Pos_Client_Query, {
		nextFetchPolicy: 'network-only',
	});

	// client form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<ClientFormType>({
		resolver: yupResolver(
			Yup.object().shape({
				name: Yup.string().required().label('Name'),
				contactNumber: Yup.string().required().label('Contact Number'),
				email: Yup.string().optional().nullable().email().label('Email'),
			})
		),
	});

	// fill form
	useEffect(() => {
		setValue('contactNumber', contactNumber);
	}, [contactNumber]);

	// client create mutation
	const [createClient, { loading: creatingClient }] = useMutation(
		PEOPLE_CREATE_CLIENT,
		Notify({
			sucTitle: 'Client created',
			onSuccess: () => {
				refetch();
				reset({
					name: '',
					email: '',
					contactNumber: '',
				});
				formInstance.setValue('client', watch('contactNumber'));
				handler.close();
			},
		})
	);

	// client form submit
	const onSubmitClientForm = (values: ClientFormType) => {
		createClient({
			variables: { body: values },
		});
	};

	// filter products
	const filterClients = (inputValue: string) => {
		return inputData.filter((i) =>
			i.value.toLowerCase().includes(inputValue.toLowerCase())
		);
	};

	// load options for input
	const loadOptions = (
		inputValue: string,
		callback: (options: any[]) => void
	) => {
		// fetch products based on search on delay 1500ms
		setTimeout(() => {
			fetchClients({
				variables: {
					where: {
						limit: -1,
						filters: {
							key: 'contactNumber',
							operator: 'contains',
							value: inputValue,
						},
					},
				},
			}).then((res) => {
				const clients: Client[] = res.data?.people__clients?.nodes || [];
				setInputData(
					clients?.map((client) => ({
						label: client.name,
						value: client.contactNumber,
					}))
				);
				setSearchedClients(clients);
			});
			callback(filterClients(inputValue));
		}, 1500);
	};

	// handle add client to form
	const handleMakeAddClientToForm = (e: any) => {
		const findClient = searchedClients?.find(
			(client) => client?.contactNumber === e
		);

		if (findClient?._id) {
			formInstance.setValue('client', findClient?._id);
		}
	};

	return (
		<div>
			<Input.Wrapper
				size='md'
				error={
					<ErrorMessage
						name='products'
						errors={formInstance.formState.errors}
					/>
				}
			>
				<Flex align={'center'} className='!w-full'>
					<AsyncSelect
						className='!w-full'
						isClearable
						cacheOptions
						loadOptions={loadOptions}
						defaultOptions
						onChange={(e: any) => handleMakeAddClientToForm(e?.value)}
					/>
					<ActionIcon
						size={42}
						variant='filled'
						color='blue'
						radius={0}
						onClick={handler.open}
					>
						<IconPlus />
					</ActionIcon>
				</Flex>
			</Input.Wrapper>

			{/* client create drawer */}
			<Drawer onClose={handler.close} opened={opened} title='Create client'>
				<form onSubmit={handleSubmit(onSubmitClientForm)}>
					<Input.Wrapper
						label='Name'
						error={<ErrorMessage name='name' errors={errors} />}
					>
						<Input placeholder='Name' {...register('name')} />
					</Input.Wrapper>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Contact Number'
						error={<ErrorMessage name='contactNumber' errors={errors} />}
					>
						<Input
							placeholder='Contact number'
							{...register('contactNumber')}
							defaultValue={watch('contactNumber')}
						/>
					</Input.Wrapper>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Email'
						error={<ErrorMessage name='email' errors={errors} />}
					>
						<Input placeholder='Email' {...register('email')} />
					</Input.Wrapper>

					<Space h={'sm'} />

					<Button type='submit' loading={creatingClient}>
						Create
					</Button>
				</form>
			</Drawer>
		</div>
	);
};

export default ClientSelectArea;