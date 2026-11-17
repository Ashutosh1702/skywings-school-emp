import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const TransportView = () => {
  const { showToast } = useToast();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    vehicleCapacity: 32,
  });

  const [stopForm, setStopForm] = useState({
    stopName: '',
    pickupTime: '07:30',
    dropTime: '15:30',
    monthlyFee: 2500,
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.getTransportRoutes();
      if (res.success) {
        setRoutes(res.data);
      }
    } catch (err) {
      showToast('Error loading routes: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createTransportRoute(routeForm);
      if (res.success) {
        showToast('Transport route and driver mapped successfully!', 'success');
        setIsRouteModalOpen(false);
        setRouteForm({
          routeName: '',
          vehicleNumber: '',
          driverName: '',
          driverPhone: '',
          vehicleCapacity: 32,
        });
        fetchRoutes();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.addTransportStop(selectedRouteId, stopForm);
      if (res.success) {
        showToast('Bus stop added to route schedule!', 'success');
        setIsStopModalOpen(false);
        setStopForm({ stopName: '', pickupTime: '07:30', dropTime: '15:30', monthlyFee: 2500 });
        fetchRoutes();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">School Fleet & Transport Logistics</h3>
          <p className="text-xs text-slate-500">Bus routes, vehicles, driver assignments, and boarding stops</p>
        </div>
        <Button onClick={() => setIsRouteModalOpen(true)}>+ Add Bus Route</Button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading transport routes..." />
      ) : routes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center text-slate-500">
          No transport routes configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{r.routeName}</h4>
                    <p className="font-mono text-xs text-blue-600 font-semibold mt-0.5">
                      {r.vehicleNumber} (Cap: {r.vehicleCapacity || r.capacity || 40} Seats)
                    </p>
                  </div>
                  <Badge status={r.status} />
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Driver:</span>
                    <span className="font-semibold">{r.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Driver Phone:</span>
                    <span className="font-mono">{r.driverPhone}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Designated Stops ({r.stops?.length || 0})
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRouteId(r._id);
                        setIsStopModalOpen(true);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      + Add Stop
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {r.stops?.map((stop, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 bg-slate-50/70 border border-slate-100 rounded"
                      >
                        <span className="font-medium text-slate-700">{stop.stopName}</span>
                        <div className="text-right text-[11px] text-slate-400 font-mono">
                          <span>Pick: {stop.pickupTime}</span> • <span>Drop: {stop.dropTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Route Modal */}
      <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title="Configure Transport Route">
        <form onSubmit={handleCreateRoute} className="space-y-4">
          <Input
            label="Route Name *"
            placeholder="e.g. Route 5 - Electronic City Express"
            value={routeForm.routeName}
            onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bus Vehicle Plate *"
              placeholder="KA-01-AB-1234"
              value={routeForm.vehicleNumber}
              onChange={(e) => setRouteForm({ ...routeForm, vehicleNumber: e.target.value })}
              required
            />
            <Input
              label="Vehicle Capacity (Seats)"
              type="number"
              value={routeForm.vehicleCapacity}
              onChange={(e) => setRouteForm({ ...routeForm, vehicleCapacity: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Assigned Driver Name *"
              placeholder="Ramesh Kumar"
              value={routeForm.driverName}
              onChange={(e) => setRouteForm({ ...routeForm, driverName: e.target.value })}
              required
            />
            <Input
              label="Driver Contact Phone *"
              placeholder="+91 98450 11223"
              value={routeForm.driverPhone}
              onChange={(e) => setRouteForm({ ...routeForm, driverPhone: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsRouteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Route
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Stop Modal */}
      <Modal isOpen={isStopModalOpen} onClose={() => setIsStopModalOpen(false)} title="Add Boarding Stop">
        <form onSubmit={handleAddStop} className="space-y-4">
          <Input
            label="Stop / Junction Name *"
            placeholder="e.g. HSR BDA Complex"
            value={stopForm.stopName}
            onChange={(e) => setStopForm({ ...stopForm, stopName: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Morning Pickup Time *"
              type="time"
              value={stopForm.pickupTime}
              onChange={(e) => setStopForm({ ...stopForm, pickupTime: e.target.value })}
              required
            />
            <Input
              label="Afternoon Drop Time *"
              type="time"
              value={stopForm.dropTime}
              onChange={(e) => setStopForm({ ...stopForm, dropTime: e.target.value })}
              required
            />
          </div>
          <Input
            label="Monthly Transport Fee (INR)"
            type="number"
            value={stopForm.monthlyFee}
            onChange={(e) => setStopForm({ ...stopForm, monthlyFee: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsStopModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add Stop
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransportView;

