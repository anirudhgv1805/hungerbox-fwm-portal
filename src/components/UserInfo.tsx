const UserInfo = ({ email, role }: { email: string; role: string | null }) => {
  return (
    <div className="text-center">
      <p className="text-gray-700">Email: {email}</p>
      <p className="text-gray-700">Sector: {role}</p>
    </div>
  );
};

export default UserInfo;
