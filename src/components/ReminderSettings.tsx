import React, { useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, Settings } from 'lucide-react';

interface Reminder {
  id: string;
  type: 'sip' | 'review' | 'milestone';
  title: string;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  nextDue: Date;
  enabled: boolean;
}

const ReminderSettings: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [sipDate, setSipDate] = useState(1);

  useEffect(() => {
    const defaultReminders: Reminder[] = [
      {
        id: '1',
        type: 'sip',
        title: 'Monthly SIP Investment',
        frequency: 'monthly',
        nextDue: new Date(new Date().getFullYear(), new Date().getMonth(), sipDate),
        enabled: true
      },
      {
        id: '2',
        type: 'review',
        title: 'Portfolio Review',
        frequency: 'quarterly',
        nextDue: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1),
        enabled: true
      },
      {
        id: '3',
        type: 'milestone',
        title: 'Goal Progress Check',
        frequency: 'yearly',
        nextDue: new Date(new Date().getFullYear() + 1, 0, 1),
        enabled: true
      }
    ];

    const saved = localStorage.getItem('sipReminders');
    setReminders(saved ? JSON.parse(saved) : defaultReminders);
  }, [sipDate]);

  const toggleReminder = (id: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('sipReminders', JSON.stringify(updatedReminders));
  };

  const updateSipDate = (date: number) => {
    setSipDate(date);
    const updatedReminders = reminders.map(reminder =>
      reminder.type === 'sip' 
        ? { ...reminder, nextDue: new Date(new Date().getFullYear(), new Date().getMonth(), date) }
        : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('sipReminders', JSON.stringify(updatedReminders));
  };

  const getNextDueText = (reminder: Reminder) => {
    const today = new Date();
    const diffTime = reminder.nextDue.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'sip': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-green-600 bg-green-100';
      case 'milestone': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('SIP Planner Notifications Enabled!', {
          body: 'You will now receive reminders for your SIP investments and reviews.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Bell className="w-6 h-6 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Reminders & Alerts</h2>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-yellow-800">Enable Browser Notifications</h3>
            <p className="text-sm text-yellow-700">Get notified about SIP dates and milestones</p>
          </div>
          <button
            onClick={requestNotificationPermission}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Enable
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">SIP Date Settings</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Preferred SIP Date:</label>
          <select
            value={sipDate}
            onChange={(e) => updateSipDate(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">of every month</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Active Reminders</h3>
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getTypeColor(reminder.type)}`}>
                {reminder.type === 'sip' && <Calendar className="w-4 h-4" />}
                {reminder.type === 'review' && <Settings className="w-4 h-4" />}
                {reminder.type === 'milestone' && <CheckCircle className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{reminder.title}</h4>
                <p className="text-sm text-gray-500">
                  {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)} • 
                  Next: {getNextDueText(reminder)}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminder.enabled}
                onChange={() => toggleReminder(reminder.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Upcoming This Month</h4>
        <div className="space-y-2">
          {reminders
            .filter(r => r.enabled && getNextDueText(r) !== 'Overdue')
            .slice(0, 3)
            .map((reminder) => (
              <div key={reminder.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{reminder.title}</span>
                <span className="text-blue-600 font-medium">{getNextDueText(reminder)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReminderSettings;