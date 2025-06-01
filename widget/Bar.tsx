import Hyprland from "gi://AstalHyprland";
import { bind, exec, GLib } from "astal";
import { Gdk, Astal, App, Gtk } from "astal/gtk4";

function Workspaces() {
  const hyprland = Hyprland.get_default();

  return (
    <box>
      {bind(hyprland, "workspaces").as((w) =>
        w
          .filter((w) => !(w.id >= -99 && w.id <= -2)) // filters out special workspaces
          .sort((a, b) => a.id - b.id)
          .map((w) => (
            <button
              cssClasses={bind(hyprland, "focusedWorkspace").as((f) =>
                w === f ? ["focused"] : [""],
              )}
              onClicked={() => w.focus()}
            >
              {w.id}
            </button>
          )),
      )}
    </box>
  );
}

function Window() {
  const hyprland = Hyprland.get_default();
  const focusedClient = bind(hyprland, "focusedClient");

  return (
    <box cssClasses={["Window"]} visible={focusedClient.as(Boolean)}>
      {focusedClient.as(
        (c) => c && <label label={bind(c, "title").as(String)} />,
      )}
    </box>
  );
}

function Power() {
  return (
    <button onClicked={() => exec("wlogout")}>
      <image iconName={"system-log-out"} />
    </button>
  );
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox cssName="centerbox">
        <box hexpand halign={Gtk.Align.START}>
          <Workspaces />
        </box>
        <box>
          <Window />
        </box>
        <box hexpand halign={Gtk.Align.END}>
          <Power />
        </box>
      </centerbox>
    </window>
  );
}
