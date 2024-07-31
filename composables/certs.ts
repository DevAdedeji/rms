export const useCertificates = () => {
  const client = useSupabaseClient();
  const fetchAllCerts = async () => {
    const certificates = await client.from("certificates").select("*");
    return certificates.data;
  };
  return { fetchAllCerts };
};
