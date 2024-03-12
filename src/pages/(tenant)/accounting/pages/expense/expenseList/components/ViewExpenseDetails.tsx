import Attachments from "@/_app/common/components/Attachments";
import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import dateFormat from "@/_app/common/utils/dateFormat";
import { Expense } from "@/_app/graphql-models/graphql";
import { FOLDER__NAME } from "@/_app/models/FolderName";
import { Divider, Paper, Text, Title } from "@mantine/core";

interface IExpenseDetailsProps {
  expenseDetails: Expense | null;
  refetch: () => void;
}

const ViewExpenseDetails: React.FC<IExpenseDetailsProps> = ({
  expenseDetails,
}) => {
  return (
    <div>
     
      <div className="flex flex-col gap-4 pb-5">
        <Paper
          p={10}
          radius={3}
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Purpose</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-gray-800">Purpose: </span>
            {expenseDetails?.purpose}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Account</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-gray-800">Account: </span>
            {`${expenseDetails?.account?.name} [${expenseDetails?.account?.referenceNumber}]`}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Amount</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-gray-800">Amount: </span>
            {currencyNumberFormat(expenseDetails?.amount || 0)} BDT
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          shadow="xs"
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Date</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-gray-800">Date: </span>
            {dateFormat(expenseDetails?.date)}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Category</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-gray-800">Category: </span>
            {(expenseDetails?.category as { name: string } | undefined)?.name ||
              ""}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Check No: </span>
            {expenseDetails?.checkNo}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Voucher No: </span>
            {expenseDetails?.voucherNo}
          </Text>
        </Paper>
        <Attachments
          attachments={expenseDetails?.attachments ?? []}
          onUploadDone={() => {}}
          enableUploader={false}
          folder={FOLDER__NAME.EXPENSE_ATTACHMENTS}
        />
      </div>
    </div>
  );
};

export default ViewExpenseDetails;
