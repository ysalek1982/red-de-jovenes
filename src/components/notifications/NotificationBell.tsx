import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../features/notifications/notificationService'
import { useAuth } from '../../features/auth/useAuth'
import type { Notification } from '../../types/database'

export function NotificationBell() {
  const { user } = useAuth()
  const userId = user?.id
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const loadNotifications = useCallback(async () => {
    if (!userId) return
    try {
      setNotifications(await getMyNotifications(userId))
    } catch {
      setNotifications([])
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadNotifications()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadNotifications])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read_at).length,
    [notifications],
  )

  async function handleOpen() {
    setIsOpen((current) => !current)
    await loadNotifications()
  }

  async function handleMarkRead(notification: Notification) {
    if (!userId || notification.read_at) return
    await markNotificationRead({ notificationId: notification.id, userId })
    await loadNotifications()
  }

  async function handleMarkAll() {
    if (!userId) return
    await markAllNotificationsRead(userId)
    await loadNotifications()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/10 hover:text-white"
        aria-label="Abrir notificaciones"
      >
        <Bell className="h-4 w-4" />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-200 px-1 text-[0.65rem] font-black text-slate-950">
            {unreadCount}
          </span>
        ) : null}
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[1.25rem] border border-white/10 bg-slate-950/97 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-black text-white">Notificaciones</p>
            <button
              type="button"
              onClick={() => void handleMarkAll()}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-200"
            >
              <CheckCheck className="h-3 w-3" /> Leidas
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link_path || '/app'}
                  onClick={() => {
                    setIsOpen(false)
                    void handleMarkRead(notification)
                  }}
                  className="block rounded-2xl px-3 py-3 transition hover:bg-white/10"
                >
                  <p className="text-sm font-bold text-white">{notification.title}</p>
                  {notification.body ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">
                      {notification.body}
                    </p>
                  ) : null}
                  {!notification.read_at ? (
                    <span className="mt-2 inline-flex rounded-full bg-amber-200/15 px-2 py-1 text-[0.65rem] font-black text-amber-100">
                      Nuevo
                    </span>
                  ) : null}
                </Link>
              ))
            ) : (
              <p className="p-3 text-sm text-white/55">
                Aqui apareceran avisos de comentarios, oraciones y comunidades.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
