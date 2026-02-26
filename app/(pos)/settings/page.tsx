"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RESTAURANT_INFO } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure restaurant and system settings</p>
      </div>

      <div className="space-y-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Restaurant Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <Input defaultValue={RESTAURANT_INFO.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Input defaultValue={RESTAURANT_INFO.address} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input defaultValue={RESTAURANT_INFO.phone} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input defaultValue={RESTAURANT_INFO.email} />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tax & Charges</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tax (PPN)</p>
                <p className="text-sm text-gray-500">Value Added Tax</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  defaultValue="11"
                  className="w-20 text-right"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Service Charge</p>
                <p className="text-sm text-gray-500">Additional service fee</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  defaultValue="0"
                  className="w-20 text-right"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Receipt Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Header
              </label>
              <Input defaultValue="Thank you for dining with us!" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Footer
              </label>
              <Input defaultValue="Please come again!" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
