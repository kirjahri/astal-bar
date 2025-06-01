import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
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
          <Window />
        </box>
        <box></box>
        <box hexpand halign={Gtk.Align.END}></box>
      </centerbox>
    </window>
  );
}
