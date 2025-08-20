import React, { Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import Button from "../button/Button";
import {
  useGetPackagesQuery,
  usePostPackagesMutation,
} from "../../redux/api/packages";
function Packages() {
  const { data: packageData } = useGetPackagesQuery();
  const packagesDataRedux = packageData && packageData.data;
  const [postPackages] = usePostPackagesMutation();
  const handlePackageSelect = async (package_id) => {
    await postPackages({ package_id })
      .unwrap()
      .then((data) => {
        if (data.status === true) {
          toast.success(data.data);
        } else {
          toast.error(data);
        }
      });
  };

  const activePackage =
    packagesDataRedux &&
    packagesDataRedux.find((packageData) => packageData.popular === "active");

  const deactivePackages =
    packagesDataRedux &&
    packagesDataRedux.filter((packageData) => packageData.popular !== "active");

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Packages</title>
      </Helmet>
      <div className="text-center">
        <p className="text-[32px] font-medium text-white max-md:text-[18px]">
          We offer flexible pricing plans, designed to meet diverse needs,
          ensuring access to our cutting-edge media monitoring services.
        </p>
      </div>
      <div className="flex justify-center py-8 max-md:flex-col max-md:gap-4">
        {deactivePackages && deactivePackages.length > 0 && (
          <div className="flex flex-col justify-center  mx-2 max-md:mx-0">
            <div
              key={deactivePackages && deactivePackages[0].id}
              className={`card duration-200 bg-gradient-to-br h-[350px] from-[#e0e1ff] to-gray-200 border border-gray-200 rounded-lg py-8 px-12  mx-2  my-1`}
            >
              <div className="text-center flex flex-col justify-between h-full">
                <p className="text-xl font-bold  uppercase">
                  {deactivePackages && deactivePackages[0].title}
                </p>
                <p className="text-[35px] font-bold ">
                  {deactivePackages && deactivePackages[0].price}₼
                  <span className="text-sm font-normal">/monthly</span>
                </p>
                <div
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: deactivePackages[0].services,
                  }}
                />
                <div className="pt-4">
                  <Button
                    onClick={() => handlePackageSelect(deactivePackages[0].id)}
                    className="bg-[#774ced] hover:bg-[#5600b3] duration-200 px-6 py-2 text-white font-bold rounded-[6px]"
                  >
                    Select
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePackage && (
          <div className="card relative duration-200 bg-gradient-to-br  from-blue-500 to-purple-600 text-white border border-blue-700 rounded-lg py-16 px-14 mx-2 my-1">
            <p className="popular absolute right-3 top-3 bg-[#41d3fa] font-medium text-[15px] text-black px-4 py-[6px] ">
              Popular
            </p>
            <div className="text-center">
              <p className="text-xl font-bold mb-4 uppercase">
                {activePackage && activePackage.title}
              </p>
              <p className="text-[42px] font-bold text-accent mb-2">
                {activePackage && activePackage.price}₼
                <span className="text-sm font-normal">/monthly</span>
              </p>
              <div
                className="mb-8"
                dangerouslySetInnerHTML={{ __html: activePackage.services }}
              />
              <Button
                onClick={() => handlePackageSelect(activePackage.id)}
                className="text-[#774ced]  font-bold bg-gradient-to-br  from-[#e0e1ff] to-gray-200 border border-gray-200 px-6 py-2 rounded-[6px]"
              >
                Select
              </Button>
            </div>
          </div>
        )}

        {deactivePackages && deactivePackages.length > 1 && (
          <div className="flex flex-col justify-center mx-2">
            <div
              key={deactivePackages && deactivePackages[1].id}
              className={`card duration-200 bg-gradient-to-br h-[350px] from-[#e0e1ff] to-gray-200 border border-gray-200 rounded-lg py-8 px-12  mx-2  my-1`}
            >
              <div className="text-center flex flex-col justify-between h-full">
                <p className="text-xl font-bold  uppercase">
                  {deactivePackages && deactivePackages[1].title}
                </p>
                <p className="text-[35px] font-bold ">
                  {deactivePackages && deactivePackages[1].price}₼
                  <span className="text-sm font-normal">/monthly</span>
                </p>
                <div
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: deactivePackages[1].services,
                  }}
                />
                <div className="pt-4">
                  <Button
                    onClick={() => handlePackageSelect(deactivePackages[1].id)}
                    className="bg-[#774ced] hover:bg-[#5600b3] duration-200 px-6 py-2 text-white font-bold rounded-[6px]"
                  >
                    Select
                  </Button>
                  <Toaster position="top-center" reverseOrder={false} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Packages;
