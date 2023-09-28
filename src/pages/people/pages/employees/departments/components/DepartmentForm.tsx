import { MatchOperator } from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Space, Textarea } from "@mantine/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import {
  CREATE_EMPLOYEE_DEPARTMENT,
  UPDATE_EMPLOYEE_DEPARTMENT,
} from "../utils/query";

interface IDepartmentFormProps {
  onFormSubmitted: () => void;
  drawerHandler: {
    open: () => void;
    close: () => void;
  };

  formData: {
    name: string;
    note: string;
    _id: string;
  };

  action: "CREATE" | "EDIT";
}
const validationSchema = Yup.object()
  .shape({
    name: Yup.string().required().label("Name"),
    note: Yup.string().optional().nullable(),
  })
  .label("Note");

interface IFormPayload {
  note?: string | null | undefined;
  name: string;
}

const DepartmentForm: React.FC<IDepartmentFormProps> = ({
  onFormSubmitted,
  drawerHandler,
  formData,
  action,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      note: "",
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    setValue("name", formData?.name);
    setValue("note", formData?.note);
  }, [formData]);

  const [createDepartment, { loading: creating }] = useMutation(
    CREATE_EMPLOYEE_DEPARTMENT,
    {
      onCompleted: () => {
        reset();
        onFormSubmitted();
        drawerHandler.close();
      },
    }
  );
  const [updateDepartment, { loading: updating }] = useMutation(
    UPDATE_EMPLOYEE_DEPARTMENT,
    {
      onCompleted: () => {
        reset();
        onFormSubmitted();
        drawerHandler.close();
      },
    }
  );

  const onSubmit = (v: IFormPayload) => {
    if (action === "CREATE") {
      createDepartment({
        variables: {
          body: v,
        },
      });
    } else {
      updateDepartment({
        variables: {
          body: {
            name: v.name,
            note: v.note,
          },
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: formData?._id,
          },
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input.Wrapper
        label="Department name"
        error={<ErrorMessage errors={errors} name="name" />}
      >
        <Input placeholder="Enter department name" {...register("name")} />
      </Input.Wrapper>
      <Space h={"sm"} />
      <Input.Wrapper
        label="Note"
        error={<ErrorMessage errors={errors} name="note" />}
      >
        <Textarea placeholder="Write note ..." {...register("note")} />
      </Input.Wrapper>
      <Space h={"sm"} />
      <Button fullWidth type="submit" loading={creating || updating}>
        Save
      </Button>
    </form>
  );
};

export default DepartmentForm;
