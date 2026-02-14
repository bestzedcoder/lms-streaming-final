import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Avatar,
  Space,
  Tooltip,
  Breadcrumb,
  Card,
  Popconfirm,
  message,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  SafetyCertificateFilled,
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { adminService } from "../../services/admin.service";
import type { UserResponse, AdminUserCreate } from "../../types/admin.types";
import { UserFormModal, LockUserModal } from "../../components/UserModals";
import { useDebounce } from "../../hooks/useDebounce";

const UserManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserResponse[]>([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });

  const [searchText, setSearchText] = useState("");
  const debouncedSearchTerm = useDebounce(searchText, 500);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLockVisible, setIsLockVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, emailQuery: string) => {
      setLoading(true);
      try {
        const res = await adminService.getUserList({
          page,
          limit: pageSize,
          email: emailQuery,
        });

        if (res.data) {
          setData(res.data.result || []);
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize: pageSize,
            total: res.data.totalElements,
          }));
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(1, pagination.pageSize || 10, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchData]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchData(
      newPagination.current || 1,
      newPagination.pageSize || 10,
      debouncedSearchTerm,
    );
  };

  const handleCreateOrUpdate = async (values: any) => {
    setActionLoading(true);
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, values);
        message.success("Cập nhật thành công!");
      } else {
        await adminService.createUser(values as AdminUserCreate);
        message.success("Tạo người dùng thành công!");
      }
      setIsFormVisible(false);
      fetchData(
        pagination.current || 1,
        pagination.pageSize || 10,
        debouncedSearchTerm,
      );
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLockUser = async (reason: string) => {
    if (!selectedUserId) return;
    setActionLoading(true);
    try {
      await adminService.lockUser({ id: selectedUserId, reason });
      message.success("Đã khóa tài khoản");
      setIsLockVisible(false);
      fetchData(
        pagination.current || 1,
        pagination.pageSize || 10,
        debouncedSearchTerm,
      );
    } catch (error) {
      message.error("Lỗi khi khóa tài khoản");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnlockUser = async (id: string) => {
    setLoading(true);
    try {
      await adminService.unlockUser({ id });
      message.success("Đã mở khóa tài khoản");
      fetchData(
        pagination.current || 1,
        pagination.pageSize || 10,
        debouncedSearchTerm,
      );
    } catch (error) {
      message.error("Lỗi khi mở khóa");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminService.deleteUser(id);
      message.success("Đã xóa người dùng");
      fetchData(
        pagination.current || 1,
        pagination.pageSize || 10,
        debouncedSearchTerm,
      );
    } catch (error) {
      message.error("Không thể xóa người dùng này");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const columns: ColumnsType<UserResponse> = [
    {
      title: "Thông tin người dùng",
      key: "user",
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3 group">
          <Avatar
            src={record.avatarUrl}
            icon={<UserOutlined />}
            size={42}
            className={`border border-gray-200 ${record.role === "INSTRUCTOR" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600"}`}
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {record.fullName}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {record.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 140,
      render: (role: string) => {
        let color = "default";
        let icon = null;
        if (role === "ADMIN") {
          color = "volcano";
          icon = <SafetyCertificateFilled />;
        }
        if (role === "INSTRUCTOR") {
          color = "blue";
        }
        if (role === "STUDENT") {
          color = "cyan";
        }

        return (
          <Tag
            color={color}
            className="rounded-full px-2.5 py-0.5 border-0 font-medium inline-flex items-center gap-1.5 shadow-sm"
          >
            {icon} {role}
          </Tag>
        );
      },
    },
    {
      title: "Kích hoạt",
      dataIndex: "active",
      key: "active",
      width: 140,
      render: (active: boolean) => (
        <div className="flex items-center gap-2">
          {active ? (
            <Badge
              status="success"
              text={
                <span className="text-gray-700 font-medium">Đã kích hoạt</span>
              }
            />
          ) : (
            <Badge
              status="default"
              text={<span className="text-gray-400">Chưa kích hoạt</span>}
            />
          )}
        </div>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-gray-700">
            {formatDate(date).split(" ")[1]}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <CalendarOutlined /> {formatDate(date).split(" ")[0]}
          </span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      render: (_, record) => (
        <Tag
          color={record.locked ? "error" : "success"}
          className="rounded-md border-0 px-2 py-0.5 flex items-center gap-1 w-fit"
        >
          {record.locked ? <CloseCircleFilled /> : <CheckCircleFilled />}
          {record.locked ? "Đã khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-blue-600" />}
              className="hover:bg-blue-50"
              onClick={() => {
                setEditingUser(record);
                setIsFormVisible(true);
              }}
            />
          </Tooltip>

          {record.locked ? (
            <Tooltip title="Mở khóa tài khoản">
              <Popconfirm
                title="Mở khóa tài khoản này?"
                onConfirm={() => handleUnlockUser(record.id)}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<UnlockOutlined className="text-green-600" />}
                  className="hover:bg-green-50"
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Khóa tài khoản">
              <Button
                type="text"
                size="small"
                icon={<LockOutlined className="text-orange-500" />}
                className="hover:bg-orange-50"
                onClick={() => {
                  setSelectedUserId(record.id);
                  setIsLockVisible(true);
                }}
              />
            </Tooltip>
          )}

          <Tooltip title="Xóa vĩnh viễn">
            <Popconfirm
              title="Xóa người dùng?"
              description="Hành động này không thể hoàn tác!"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteUser(record.id)}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in p-2">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Breadcrumb
            items={[{ title: "Admin" }, { title: "Người dùng" }]}
            className="mb-1 text-gray-500"
          />
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            Danh sách người dùng
          </h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-200 border-none font-medium px-6 h-10"
          onClick={() => {
            setEditingUser(null);
            setIsFormVisible(true);
          }}
        >
          Thêm mới
        </Button>
      </div>

      <Card
        bordered={false}
        className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-1">
          <div className="w-full sm:max-w-md relative">
            <Input
              placeholder="Tìm kiếm theo email..."
              prefix={<SearchOutlined className="text-gray-400 text-lg mr-2" />}
              size="large"
              className="rounded-full bg-gray-50 border-transparent hover:bg-white hover:border-gray-300 focus:bg-white focus:border-indigo-500 transition-all pl-5"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          <div className="flex gap-3 text-gray-500">
            <Tooltip title="Làm mới dữ liệu">
              <Button
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={() =>
                  fetchData(
                    pagination.current || 1,
                    pagination.pageSize || 10,
                    debouncedSearchTerm,
                  )
                }
                className="hover:text-indigo-600 border-gray-200"
              />
            </Tooltip>
            <div className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-semibold">
              {pagination.total} users
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1100 }}
          className="ant-table-striped"
        />
      </Card>

      <UserFormModal
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onSubmit={handleCreateOrUpdate}
        loading={actionLoading}
        editingUser={editingUser}
      />

      <LockUserModal
        visible={isLockVisible}
        onCancel={() => setIsLockVisible(false)}
        onSubmit={handleLockUser}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserManagementPage;
