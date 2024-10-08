import ViewDashboardLayout from "@/commons/components/layouts/ViewDashboard";
import { Employee, EmployeeDepartment } from "@/commons/graphql-models/graphql";
import { NavLink, Paper, Text, Title } from "@mantine/core";
import {
  IconChartArrowsVertical,
  IconCurrencyTaka,
  IconUserBolt,
} from "@tabler/icons-react";
import { useState } from "react";
import EmployeeDetailsBasicInfo from "./employee-details/EmployeeDetailsBasicInfo";
import EmployeeDetailsIncrements from "./employee-details/EmployeeDetailsIncrements";
import EmployeeDetailsPayrolls from "./employee-details/EmployeeDetailsPayrolls";
import { IconPaperclip } from "@tabler/icons-react";
import EmployeeDetailsDocuments from "./employee-details/EmployeeDetailsDocuments";

interface IEmployeesDetailsFormProps {
  employeeDetails: Employee | null;
  departments: EmployeeDepartment[] | null;
  refetch: () => void;
}

const ViewEmployeeDetails: React.FC<IEmployeesDetailsFormProps> = ({
  employeeDetails,
  departments,
  refetch,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <ViewDashboardLayout
      TopSection={
        <Paper shadow="sm" p={"sm"} withBorder>
          <Title order={3}>{employeeDetails?.name}</Title>
          <Text fz={"sm"}>{employeeDetails?.designation}</Text>
          <Text fz={"sm"}>{employeeDetails?.department?.name}</Text>
          <Text fz={"sm"}>Salary: {employeeDetails?.salary || 0} BDT</Text>
        </Paper>
      }
      NavSection={
        <>
          <NavLink
            label={"Basic Information"}
            icon={<IconUserBolt size={16} />}
            onClick={() => setActiveTab(0)}
            active={activeTab === 0}
          />
          <NavLink
            label={"Payrolls"}
            icon={<IconCurrencyTaka size={16} />}
            onClick={() => setActiveTab(1)}
            active={activeTab === 1}
          />
          <NavLink
            label={"Increments"}
            icon={<IconChartArrowsVertical size={16} />}
            onClick={() => setActiveTab(2)}
            active={activeTab === 2}
          />
          <NavLink
            label={"Documents"}
            icon={<IconPaperclip size={16} />}
            onClick={() => setActiveTab(3)}
            active={activeTab === 3}
          />
        </>
      }
    >
      {activeTab === 0 && (
        <EmployeeDetailsBasicInfo
          employeeDetails={employeeDetails}
          departments={departments || []}
        />
      )}
      {activeTab === 1 && (
        <EmployeeDetailsPayrolls employeeDetails={employeeDetails} />
      )}
      {activeTab === 2 && (
        <EmployeeDetailsIncrements id={employeeDetails?._id} />
      )}
      {activeTab === 3 && (
        <EmployeeDetailsDocuments
          employeeDetails={employeeDetails}
          refetch={refetch}
        />
      )}
    </ViewDashboardLayout>
  );
};

export default ViewEmployeeDetails;
