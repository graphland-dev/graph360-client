import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import Attachments from '@/commons/components/Attactment/Attachments.tsx';
import {
  MatchOperator,
  ServerFileReference,
  Supplier,
} from '@/commons/graphql-models/graphql';
import { FOLDER__NAME } from '@/commons/models/FolderName';
import { useMutation } from '@apollo/client';
import React from 'react';
import { PEOPLE_UPDATE_SUPPLIERS } from '../../utils/suppliers.query';

interface ISupplierDetailsProps {
  supplierDetails: Supplier | null;
  refetch: () => void;
}

const SupplierDetailsDocuments: React.FC<ISupplierDetailsProps> = ({
  supplierDetails,
  refetch,
}) => {
  const attachments =
    supplierDetails?.attachments?.map((file) => ({
      meta: file.meta,
      path: file.path,
      provider: file.provider,
    })) ?? [];

  // update suppliers
  const [updateAttachmentsMutation] = useMutation(
    PEOPLE_UPDATE_SUPPLIERS,
    commonNotifierCallback({
      successTitle: 'Attachments saved successfully!',
      onSuccess() {
        refetch();
      },
    }),
  );

  const handleUpload = (files: ServerFileReference[]) => {
    updateAttachmentsMutation({
      variables: {
        where: {
          key: '_id',
          operator: MatchOperator.Eq,
          value: supplierDetails?._id,
        },
        body: {
          attachments: files?.map((att) => ({
            meta: att?.meta,
            path: att?.path,
            provider: att?.provider,
          })),
        },
      },
    });
  };

  return (
    <div>
      <Attachments
        title="Documents"
        attachments={attachments}
        enableUploader
        onUploadDone={(files) => {
          console.log(files);
          handleUpload(files);
        }}
        folder={FOLDER__NAME.SUPPLIER_ATTACHMENTS}
      />
      {/* {uploadedfiles.length > 0 && (
        <Flex justify={"end"} mt={"md"}>
          <Button
            color="yellow.8"
            onClick={handleUpload}
            loading={loading}
            leftIcon={<IconUpload size={20} />}
          >
            Upload
          </Button>
        </Flex>
      )} */}
    </div>
  );
};

export default SupplierDetailsDocuments;
