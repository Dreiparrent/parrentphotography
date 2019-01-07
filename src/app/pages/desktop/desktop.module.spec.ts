import { DesktopModule } from './desktop.module';

describe('DesktopModule', () => {
  let desktopModule: DesktopModule;

  beforeEach(() => {
    desktopModule = new DesktopModule();
  });

  it('should create an instance', () => {
    expect(desktopModule).toBeTruthy();
  });
});
