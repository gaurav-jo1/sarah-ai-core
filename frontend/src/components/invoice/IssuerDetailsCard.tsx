import React from "react";
import type { IssuerDetails } from "../../types/invoice.types";
import { Building2, Globe, Mail, Phone } from "lucide-react";

const IssuerDetailsCard: React.FC<{ details: IssuerDetails }> = ({
  details,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center mb-2">
            <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
            {details.name}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{details.address}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center text-slate-600">
            <Phone className="w-4 h-4 mr-2 text-slate-400" />
            {details.phone}
          </div>
          <div className="flex items-center text-slate-600">
            <Mail className="w-4 h-4 mr-2 text-slate-400" />
            <a
              href={`mailto:${details.email}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {details.email}
            </a>
          </div>
          <div className="flex items-center text-slate-600 md:col-span-2">
            <Globe className="w-4 h-4 mr-2 text-slate-400" />
            <a
              href={`https://${details.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              {details.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuerDetailsCard;
