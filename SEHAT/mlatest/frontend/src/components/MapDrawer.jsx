import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MapIcon, MapPinIcon, ShieldExclamationIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const MapDrawer = ({ isOpen, setIsOpen }) => {
  const mapFeatures = [
    {
      name: 'Safe Route',
      description: 'Find the safest route to your destination',
      icon: MapIcon,
      path: '/safe'
    },
    {
      name: 'Report Unsafe Area',
      description: 'Mark and report unsafe locations',
      icon: ShieldExclamationIcon,
      path: '/unsafe'
    },
    {
      name: 'View Safe Spots',
      description: 'See all verified safe locations',
      icon: MapPinIcon,
      path: '/all'
    },
    {
      name: 'Generate Report',
      description: 'View and download safety reports',
      icon: ChartBarIcon,
      path: '/report'
    }
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Map Features
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mapFeatures.map((feature) => (
                    <Link
                      key={feature.name}
                      to={feature.path}
                      onClick={() => setIsOpen(false)}
                      className="block p-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="flex-shrink-0 mb-4">
                          <feature.icon className="h-12 w-12 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">
                            {feature.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MapDrawer;